from pydantic import BaseModel


class VoucherLogin(BaseModel):
    """The data needed to login with a voucher."""

    voucher_code: str


class VoucherClaim(VoucherLogin):
    """A JWT for a verified voucher."""

    jwt: str
