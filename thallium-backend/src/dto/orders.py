from decimal import Decimal

from pydantic import BaseModel

from src.dto import Voucher


class OrderRecipient(BaseModel):
    """Information about the recipient of the order."""

    name: str
    company: str | None = None
    address1: str
    address2: str
    city: str
    state_code: str | None = None
    state_name: str | None = None
    country_code: str
    country_name: str
    zip: str
    phone: str
    email: str
    tax_number: str | None = None


class OrderItem(BaseModel):
    """Information about the items in the order."""

    product_template_id: int
    variant_id: int
    quantity: int


class OrderCreate(BaseModel):
    """Data required to create an order."""

    recipient: OrderRecipient
    items: list[OrderItem]

    def as_printful_payload(self, voucher: Voucher) -> dict:
        """Return this order in the format used by Printful's API."""
        return {
            "external_id": voucher.id,
            "recipient": self.recipient.model_dump(),
            "items": [item.model_dump() for item in self.items],
        }


class OrderCosts(BaseModel):
    """All costs associated with an order."""

    currency: str
    subtotal: Decimal
    discount: Decimal
    shipping: Decimal
    digitization: Decimal
    additional_fee: Decimal
    fulfillment_fee: Decimal
    retail_delivery_fee: Decimal
    tax: Decimal
    vat: Decimal
    total: Decimal


class Order(OrderCreate):
    """The order as returned by printful."""

    id: int
    status: str
    costs: OrderCosts
