from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class VoucherCreate(BaseModel):
    """The data required to create a new Voucher."""

    voucher_code: str
    balance: Decimal


class Voucher(VoucherCreate):
    """A voucher as stored in the database."""

    id: UUID
    created_at: datetime
    updated_at: datetime
    active: bool
