from enum import IntFlag
from uuid import UUID

from pydantic import BaseModel


class UserPermission(IntFlag):
    """The permissions a user has."""

    VIEW_VOUCHERS = 2**0
    ISSUE_VOUCHERS = 2**1
    REVOKE_VOUCHERS = 2**1
    VIEW_PRODUCTS = 2**2
    MANAGE_USERS = 2**3
    UPDATE_TEMPLATES = 2**4


class User(BaseModel):
    """An user authenticated with the backend."""

    id: UUID
    permissions: int

    def has_permission(self, permission: UserPermission) -> bool:
        """Whether the user has the given permission."""
        return (self.permissions & permission) == permission
