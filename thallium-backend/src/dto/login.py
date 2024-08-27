from pydantic import BaseModel


class VoucherLogin(BaseModel):
    """The data needed to login with a voucher."""

    voucher_code: str


class VoucherClaim(VoucherLogin):
    """A JWT for a verified voucher."""

    jwt: str


class UserLogin(BaseModel):
    """The data needed to login as a user."""

    username: str
    password: str


class UserClaim(BaseModel):
    """The response given to a successfully logged in user."""

    username: str
    permissions: int
    require_password_change: bool
    jwt: str


class PasswordReset(BaseModel):
    """The request body required to reset a user's password."""

    new_password: str
    password_reset_code: str
