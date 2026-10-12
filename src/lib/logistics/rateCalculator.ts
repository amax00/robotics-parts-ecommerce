import { CartItem, CarrierOption } from '../../types';

export interface ShippingCalculationResult {
  totalDeadWeightGrams: number;
  totalVolumetricWeightGrams: number;
  billableWeightGrams: number;
  containsHazmatBattery: boolean;
  hazmatNotice?: string;
  options: CarrierOption[];
}

export function calculateShipping(items: CartItem[], destinationPincode: string): ShippingCalculationResult {
  let totalDeadWeight = 0;
  let totalVolumeCm3 = 0;
  let hasBattery = false;
  let batteryHazmatType: string | null = null;

  items.forEach((item) => {
    const qty = item.quantity;
    totalDeadWeight += item.variant.deadWeightGrams * qty;
    totalVolumeCm3 += (item.variant.lengthCm * item.variant.widthCm * item.variant.heightCm) * qty;

    if (item.product.isHazardousBattery) {
      hasBattery = true;
      batteryHazmatType = item.product.hazmatType;
    }
  });

  // Standard Volumetric Weight formula: (L x W x H in cm) / 5000 = kg -> * 1000 = grams
  const volumetricWeightGrams = Math.round((totalVolumeCm3 / 5000) * 1000);
  const billableWeightGrams = Math.max(totalDeadWeight, volumetricWeightGrams);

  const baseRate = Math.max(80, Math.round((billableWeightGrams / 500) * 45));

  const allCouriers: CarrierOption[] = [
    {
      code: 'DELHIVERY_SURFACE',
      name: 'Delhivery Surface Logistics (Ground)',
      mode: 'SURFACE',
      rate: baseRate,
      estimatedDays: 3,
      estimatedDate: '3-4 Business Days',
      isAllowedForHazmat: true,
    },
    {
      code: 'BLUEDART_SURFACE',
      name: 'BlueDart Ground Cargo',
      mode: 'SURFACE',
      rate: baseRate + 25,
      estimatedDays: 2,
      estimatedDate: '2-3 Business Days',
      isAllowedForHazmat: true,
    },
    {
      code: 'BLUEDART_AIR_EXPRESS',
      name: 'BlueDart Air Express (Priority Flight)',
      mode: 'AIR',
      rate: baseRate + 110,
      estimatedDays: 1,
      estimatedDate: 'Next Business Day',
      isAllowedForHazmat: false, // Disallowed for standalone Lithium batteries!
    },
  ];

  // Enforce Aviation Safety Lockdown:
  const allowedOptions = hasBattery
    ? allCouriers.filter((c) => c.isAllowedForHazmat)
    : allCouriers;

  return {
    totalDeadWeightGrams: totalDeadWeight,
    totalVolumetricWeightGrams: volumetricWeightGrams,
    billableWeightGrams,
    containsHazmatBattery: hasBattery,
    hazmatNotice: hasBattery
      ? `Contains Lithium Battery (${batteryHazmatType}). Aviation safety regulations require strict Surface (Ground) transport.`
      : undefined,
    options: allowedOptions,
  };
}
