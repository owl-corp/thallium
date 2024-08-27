import logging
import typing as t
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import jwt
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security.http import HTTPBearer
from sqlalchemy import select

from src.dto import User, UserPermission, Voucher
from src.orm import User as DBUser, Voucher as DBVoucher
from src.settings import CONFIG, DBSession

log = logging.getLogger(__name__)


class TokenAuth(HTTPBearer):
    """Ensure all requests with this auth enabled include an auth header with the expected token."""

    def __init__(
        self,
        *,
        auto_error: bool = True,
        allow_vouchers: bool = False,
        allow_regular_users: bool = False,
    ) -> None:
        super().__init__(scheme_name="bearer", bearerFormat="JWT", auto_error=auto_error)
        self.allow_vouchers = allow_vouchers
        self.allow_regular_users = allow_regular_users

    async def __call__(self, request: Request, db: DBSession) -> HTTPAuthorizationCredentials:
        """Parse the token in the auth header, and check it matches with the expected token."""
        creds: HTTPAuthorizationCredentials = await super().__call__(request)
        if creds.scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Incorrect scheme passed",
            )
        if self.allow_regular_users and creds.credentials == CONFIG.super_admin_token.get_secret_value():
            request.state.user = User(id=uuid4(), permissions=~UserPermission(0))
            return

        jwt_data = verify_jwt(
            creds.credentials,
            allow_vouchers=self.allow_vouchers,
            allow_regular_users=self.allow_regular_users,
        )
        if not jwt_data:
            raise HTTPException(
                status_code=403,
                detail="Invalid authentication credentials",
            )
        await self.attach_auth_info_to_state(jwt_data, request, db)

    async def attach_auth_info_to_state(self, jwt_data: dict, request: Request, db: DBSession) -> None:
        """Attach the auth info of the requesting user to the state object."""
        requester_id = jwt_data["sub"]
        table = DBUser if jwt_data["iss"] == "thallium:user" else DBVoucher

        stmt = select(table).where(table.id == requester_id)
        res = await db.scalar(stmt)

        if isinstance(res, DBUser):
            request.state.user = User.model_validate(res.__dict__)
        elif isinstance(res, DBVoucher):
            request.state.voucher = Voucher.model_validate(res.__dict__)
        else:
            raise HTTPException(403, "Your user no longer exists")


def build_jwt(
    identifier: str,
    user_type: t.Literal["voucher", "user"],
) -> str:
    """Build & sign a jwt."""
    return jwt.encode(
        payload={
            "sub": identifier,
            "iss": f"thallium:{user_type}",
            "exp": datetime.now(tz=UTC) + timedelta(minutes=30),
            "nbf": datetime.now(tz=UTC) - timedelta(minutes=1),
        },
        key=CONFIG.signing_key.get_secret_value(),
    )


def verify_jwt(
    jwt_data: str,
    *,
    allow_vouchers: bool,
    allow_regular_users: bool,
) -> dict | None:
    """Return and verify the given JWT."""
    issuers = []
    if allow_vouchers:
        issuers.append("thallium:voucher")
    if allow_regular_users:
        issuers.append("thallium:user")
    try:
        return jwt.decode(
            jwt_data,
            key=CONFIG.signing_key.get_secret_value(),
            issuer=issuers,
            algorithms=("HS256",),
            options={"require": ["exp", "iss", "sub", "nbf"]},
        )
    except jwt.InvalidIssuerError as e:
        raise HTTPException(403, "Your user type does not have access to this resource") from e
    except jwt.InvalidSignatureError as e:
        raise HTTPException(401, "Invalid JWT signature") from e
    except (jwt.DecodeError, jwt.MissingRequiredClaimError, jwt.InvalidAlgorithmError) as e:
        raise HTTPException(401, "Invalid JWT passed") from e
    except (jwt.ImmatureSignatureError, jwt.ExpiredSignatureError) as e:
        raise HTTPException(401, "JWT not valid for current time") from e


class MissingPermissionsError(HTTPException):
    """Raised when a user is missing the required permissions."""

    def __init__(self) -> None:
        super().__init__(403, "Missing permissions for this resource.")


class HasPermission:
    """
    Check the requesting user has all specified permissions.

    Raises MissingPermissions if not.
    """

    def __init__(self, required_permissions: UserPermission, *, allow_vouchers: bool = False) -> None:
        self.required_permissions = required_permissions
        self.allow_vouchers = allow_vouchers

    async def __call__(self, request: Request) -> None:
        """Check the requesting user has all specified permissions."""
        if hasattr(request.state, "voucher") and self.allow_vouchers:
            return
        if not request.state.user.permissions & self.required_permissions == self.required_permissions:
            raise MissingPermissionsError
