import { CartItem } from '../../types';

export interface TaxCalculationResult {
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  isInterstate: boolean;
}

const WAREHOUSE_STATE_CODE = '29'; // Default Warehouse State (e.g., Karnataka)

export function calculateTax(items: CartItem[], buyerStateCode: string = '29'): TaxCalculationResult {
  const taxableAmount = items.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
  const isInterstate = buyerStateCode !== WAREHOUSE_STATE_CODE;
  const standardGstRate = 0.18; // 18% standard for robotics electronics & batteries

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterstate) {
    igstAmount = Math.round(taxableAmount * standardGstRate);
  } else {
    cgstAmount = Math.round(taxableAmount * (standardGstRate / 2));
    sgstAmount = Math.round(taxableAmount * (standardGstRate / 2));
  }

  const totalTax = cgstAmount + sgstAmount + igstAmount;

  return {
    taxableAmount,
    cgstRate: isInterstate ? 0 : 0.09,
    cgstAmount,
    sgstRate: isInterstate ? 0 : 0.09,
    sgstAmount,
    igstRate: isInterstate ? 0.18 : 0,
    igstAmount,
    totalTax,
    isInterstate,
  };
}
