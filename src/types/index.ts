export type HazmatCategory = 'NONE' | 'UN3480_STANDALONE' | 'UN3481_IN_EQUIPMENT';

export type CustomerType = 'B2C' | 'B2B';

export type TransportMode = 'SURFACE' | 'AIR';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  voltage?: string;
  rpm?: number;
  torque?: string;
  shaft?: string;
  stockOnHand: number;
  stockReserved: number;
  deadWeightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  hsnCode: string;
  binLocation: string; // e.g., 'Z1-A03-R02-S1-B04'
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'Motors' | 'Drivers' | 'Batteries' | 'Sensors' | 'Kits' | 'Hardware';
  description: string;
  isHazardousBattery: boolean;
  hazmatType: HazmatCategory;
  wattHours?: number;
  imageUrl: string;
  variants: ProductVariant[];
  specs: Record<string, string>;
  kitItems?: { name: string; quantity: number; partUrl?: string }[];
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CarrierOption {
  code: string;
  name: string;
  mode: TransportMode;
  rate: number;
  estimatedDays: number;
  estimatedDate: string;
  isAllowedForHazmat: boolean;
}

export interface RFQItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  hsnCode: string;
  total: number;
}

export interface RFQDocument {
  rfqId: string;
  companyName: string;
  gstin: string;
  date: string;
  validUntil: string;
  items: RFQItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  status: 'PENDING_APPROVAL' | 'PROFORMA_ISSUED' | 'PO_ATTACHED' | 'RECONCILED';
}
