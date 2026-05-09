export interface ShippingInfo {
  firstName: string;
  lastName: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  email: string;
  orderNotes?: string;
}

export interface CheckoutScenario {
  id: string;
  name: string;
  productName: string;
  shipping: ShippingInfo;
  profile: "smoke";
}
