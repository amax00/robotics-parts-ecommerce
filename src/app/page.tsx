'use client';

import React, { useState, useMemo } from 'react';
import { mockCatalog } from '../data/mockCatalog';
import { Product, ProductVariant, CartItem } from '../types';
import { calculateShipping } from '../lib/logistics/rateCalculator';
import { calculateTax } from '../lib/tax/taxCalculator';
import { 
  Cpu, 
  BatteryCharging, 
  Layers, 
  ShieldAlert, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Barcode, 
  Truck, 
  Info,
  Clock,
  Printer
} from 'lucide-react';

export default function HomePage() {
  // Catalog State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVariants, setActiveVariants] = useState<Record<string, string>>({
    'prod-001': 'v-001',
    'prod-002': 'v-101',
    'prod-003': 'v-201',
    'prod-004': 'v-301',
    'prod-005': 'v-401',
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: mockCatalog[0],
      variant: mockCatalog[0].variants[0],
      quantity: 2,
    },
  ]);
  const [destinationPincode, setDestinationPincode] = useState<string>('560001');
  const [showUPICheckout, setShowUPICheckout] = useState<boolean>(false);

  // B2B State
  const [b2bOrgName, setB2bOrgName] = useState<string>('Advanced Robotics Lab, Tech Institute');
  const [b2bGSTIN, setB2bGSTIN] = useState<string>('29AAAAA0000A1Z5');
  const [b2bStateCode, setB2bStateCode] = useState<string>('29');
  const [rfqGenerated, setRfqGenerated] = useState<boolean>(false);

  // WMS Scanner State
  const [scannedSkus, setScannedSkus] = useState<string[]>([]);
  const [awbGenerated, setAwbGenerated] = useState<boolean>(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return mockCatalog;
    return mockCatalog.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Shipping & Tax Calculations
  const shippingResult = useMemo(() => {
    return calculateShipping(cart, destinationPincode);
  }, [cart, destinationPincode]);

  const taxResult = useMemo(() => {
    return calculateTax(cart, b2bStateCode);
  }, [cart, b2bStateCode]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
  }, [cart]);

  const cartTotal = cartSubtotal + (shippingResult.options[0]?.rate || 0);

  // Handlers
  const handleVariantChange = (productId: string, variantId: string) => {
    setActiveVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> NextGen Direct-Inventory Robotics Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            High-Precision Robotics Parts & Starter Kits
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Directly stocked in our regional fulfillment warehouse. Features parametric variant selection, real-time stock allocation with 15-minute concurrency locks, certified UN3480 battery surface logistics, and instant B2B Request for Quote (RFQ) generation.
          </p>
        </div>
      </div>

      {/* SECTION 1: CATALOG & PARAMETRIC COMPONENT BROWSER */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-sky-400" />
              1. Parametric Component Catalog
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select attributes (RPM, voltage, connectors) to dynamically update live stock counts, pricing, and bin coordinates.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Motors', 'Drivers', 'Batteries', 'Kits', 'Sensors'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const activeVariantId = activeVariants[product.id] || product.variants[0].id;
            const currentVariant = product.variants.find((v) => v.id === activeVariantId) || product.variants[0];
            const isOutOfStock = currentVariant.stockOnHand <= 0;
            const isLowStock = currentVariant.stockOnHand > 0 && currentVariant.stockOnHand <= 3;

            return (
              <div
                key={product.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-4">
                  <div className="relative h-44 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800/80">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-sky-400 text-[10px] font-mono border border-slate-700">
                        {product.category}
                      </span>
                      {product.isHazardousBattery && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow">
                          <BatteryCharging className="w-3 h-3" /> {product.hazmatType}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{product.name}</h3>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">{product.description}</p>
                  </div>

                  {/* Parametric Variant Selector Chips */}
                  {product.variants.length > 1 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Select Specification / RPM:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {product.variants.map((v) => {
                          const isSelected = v.id === currentVariant.id;
                          const hasStock = v.stockOnHand > 0;
                          return (
                            <button
                              key={v.id}
                              onClick={() => handleVariantChange(product.id, v.id)}
                              className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
                                isSelected
                                  ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                                  : hasStock
                                  ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                                  : 'bg-slate-950/40 text-slate-600 border-slate-800/40 line-through'
                              }`}
                            >
                              {v.rpm ? `${v.rpm} RPM` : v.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Live Warehouse & Spec Metadata */}
                  <div className="bg-slate-950/70 rounded-lg p-3 border border-slate-800/60 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">SKU:</span>
                      <span className="text-slate-200">{currentVariant.sku}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Warehouse Bin:</span>
                      <span className="text-amber-400 font-bold">{currentVariant.binLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inventory Status:</span>
                      {isOutOfStock ? (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Only {currentVariant.stockOnHand} left!
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {currentVariant.stockOnHand} in Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Kit Checklist (If Bundle) */}
                  {product.kitItems && (
                    <div className="p-2.5 rounded-lg bg-sky-950/20 border border-sky-800/30 text-xs space-y-1">
                      <span className="font-semibold text-sky-400 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Included in Starter Box:
                      </span>
                      <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                        {product.kitItems.map((item, i) => (
                          <li key={i}>{item.quantity}x {item.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Unit Price (excl. tax)</span>
                    <span className="text-xl font-bold text-white font-mono">
                      ₹{currentVariant.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(product, currentVariant)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      isOutOfStock
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: SHOPPING CART & HAZMAT LOGISTICS ENGINE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-800 pt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-400" />
              2. Cart & Hazmat Logistics Calculator
            </h2>
            <span className="text-xs text-slate-400 font-mono">{cart.length} unique line items</span>
          </div>

          {/* Hazardous Goods Advisory Banner */}
          {shippingResult.containsHazmatBattery && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Lithium Battery Aviation Restriction Active (UN3480 / UN3481)</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your cart contains high-discharge Lithium cells. In strict compliance with IATA/civil aviation safety mandates, **Air Express shipping has been disabled**. Dispatch is enforced via ground surface cargo with official thermal Dangerous Goods markings.
                </p>
              </div>
            </div>
          )}

          {/* Line Items List */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.variant.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Variant: {item.variant.name}</span>
                    <span>•</span>
                    <span>SKU: {item.variant.sku}</span>
                    <span>•</span>
                    <span>HSN: {item.variant.hsnCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm font-mono text-slate-200">
                    {item.quantity} × ₹{item.variant.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => handleRemoveFromCart(item.variant.id)}
                    className="text-xs text-red-400 hover:text-red-300 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Volumetric Weight vs Dead Weight Debugging Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2 font-mono">
            <span className="text-slate-400 font-semibold block">Logistics Rate Breakdown:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">Dead Weight</span>
                <span>{shippingResult.totalDeadWeightGrams} g</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Volumetric Weight</span>
                <span>{shippingResult.totalVolumetricWeightGrams} g</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Billable Weight</span>
                <span className="text-sky-400 font-bold">{shippingResult.billableWeightGrams} g</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Hazmat Ground Enforced</span>
                <span className={shippingResult.containsHazmatBattery ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {shippingResult.containsHazmatBattery ? 'YES (Surface Only)' : 'NO (Air Eligible)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Payment Gateway Simulator */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-6 h-fit">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Checkout & Dispatch SLA</h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Destination Pincode:</label>
              <input
                type="text"
                value={destinationPincode}
                onChange={(e) => setDestinationPincode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-slate-400 font-medium">Available Carrier Options:</label>
              {shippingResult.options.map((opt) => (
                <div
                  key={opt.code}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-200 block text-xs">{opt.name}</span>
                    <span className="text-[11px] text-slate-400">{opt.estimatedDate}</span>
                  </div>
                  <span className="font-mono text-sky-400 font-bold">₹{opt.rate}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (18% GST):</span>
                <span>₹{taxResult.totalTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping:</span>
                <span>₹{shippingResult.options[0]?.rate || 0}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="text-sky-400">
                  ₹{(cartTotal + taxResult.totalTax).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setShowUPICheckout(!showUPICheckout)}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-sky-500/20"
            >
              <QrCode className="w-4 h-4" /> Instant B2C Checkout (UPI / Card 3DS)
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Acquires a 15-minute Redis distributed stock lock upon initiation.
            </p>
          </div>

          {/* Dynamic UPI Modal Preview */}
          {showUPICheckout && (
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/40 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
                <Clock className="w-3 h-3" /> Stock Reserved: 14:52 remaining
              </div>
              <div className="w-36 h-36 mx-auto bg-white rounded-lg p-2 flex items-center justify-center border-2 border-slate-800">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=roboparts@bank&pn=RoboPartsDirect&am=4500"
                  alt="Dynamic UPI QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-300">Scan with Google Pay, PhonePe, or Paytm</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: B2B INSTITUTIONAL RFQ & PROFORMA INVOICE GENERATOR */}
      <section id="b2b-rfq" className="border-t border-slate-800 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              3. B2B Institutional RFQ & Formal Proforma Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              For university research grants and corporate buyers. Generates locked 14-day Proforma Quotations with HSN and statutory tax splits.
            </p>
          </div>

          <button
            onClick={() => setRfqGenerated(true)}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" /> Generate Official Proforma PDF (RFQ)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Institution / Company Name:</label>
            <input
              type="text"
              value={b2bOrgName}
              onChange={(e) => setB2bOrgName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Company GSTIN / Tax ID:</label>
            <input
              type="text"
              value={b2bGSTIN}
              onChange={(e) => setB2bGSTIN(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Tax State Code (Warehouse = 29):</label>
            <select
              value={b2bStateCode}
              onChange={(e) => setB2bStateCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="29">State 29 (Intrastate: CGST 9% + SGST 9%)</option>
              <option value="27">State 27 (Interstate: IGST 18%)</option>
              <option value="07">State 07 (Interstate: IGST 18%)</option>
            </select>
          </div>
        </div>

        {/* Live Proforma Document Preview */}
        {rfqGenerated && (
          <div className="p-6 rounded-2xl border border-amber-500/30 bg-slate-900/90 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-amber-400 font-bold text-sm block">PROFORMA QUOTATION (RFQ-2026-9041)</span>
                <span className="text-slate-400">Client: {b2bOrgName} | GSTIN: {b2bGSTIN}</span>
              </div>
              <div className="text-right text-slate-400">
                <span>Price Lock: Valid for 14 Days</span>
                <span className="block text-emerald-400 font-bold">Status: Awaiting PO / Wire Remittance</span>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">HSN Code</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cart.map((item) => (
                  <tr key={item.variant.id}>
                    <td className="py-2.5 text-slate-200">{item.product.name} ({item.variant.name})</td>
                    <td className="py-2.5 text-sky-400">{item.variant.hsnCode}</td>
                    <td className="py-2.5 text-center text-slate-200">{item.quantity}</td>
                    <td className="py-2.5 text-right text-slate-300">₹{item.variant.price.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-right font-bold text-slate-100">
                      ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-end">
              <div className="text-slate-400 text-[11px] space-y-1">
                <span>Beneficiary: RoboParts Direct Solutions Pvt Ltd</span>
                <span className="block">Virtual Account (VAN): RPD9823480029</span>
                <span className="block">IFSC Code: HDFC0000123</span>
              </div>

              <div className="text-right space-y-1">
                <span className="text-slate-400 block">Subtotal: ₹{taxResult.taxableAmount.toLocaleString('en-IN')}</span>
                {taxResult.isInterstate ? (
                  <span className="text-slate-400 block">IGST (18%): ₹{taxResult.igstAmount.toLocaleString('en-IN')}</span>
                ) : (
                  <>
                    <span className="text-slate-400 block">CGST (9%): ₹{taxResult.cgstAmount.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400 block">SGST (9%): ₹{taxResult.sgstAmount.toLocaleString('en-IN')}</span>
                  </>
                )}
                <span className="text-amber-400 font-bold text-sm block pt-1 border-t border-slate-800">
                  Total Payable: ₹{(taxResult.taxableAmount + taxResult.totalTax).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: WMS WAREHOUSE PACKING STATION & SCANNER SIMULATOR */}
      <section id="wms-station" className="border-t border-slate-800 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Barcode className="w-5 h-5 text-emerald-400" />
              4. WMS Packing Station Barcode Scanner Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Simulates the warehouse operator view. Every picked item barcode is scanned to prevent wrong-variant shipments before courier AWB generation.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono">
            <span>Order Manifest ID: ORD-2026-8912</span>
            <span>Assigned Dispatch SLA: Today 2:00 PM (Same-Day)</span>
            <span className="text-amber-400">Carrier: Delhivery Surface Cargo</span>
          </div>

          <div className="space-y-3">
            {cart.map((item) => {
              const isScanned = scannedSkus.includes(item.variant.sku);
              return (
                <div
                  key={item.variant.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition ${
                    isScanned
                      ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-bold text-sm block text-white">{item.product.name}</span>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span>Expected SKU: {item.variant.sku}</span>
                      <span>•</span>
                      <span className="text-amber-400">Bin Coordinate: {item.variant.binLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isScanned ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                        <CheckCircle2 className="w-4 h-4" /> Barcode Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => setScannedSkus((prev) => [...prev, item.variant.sku])}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition"
                      >
                        <Barcode className="w-3.5 h-3.5" /> Simulate Scan Barcode
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-mono">
              Scanned: {scannedSkus.length} / {cart.length} items verified
            </span>

            <button
              disabled={scannedSkus.length < cart.length}
              onClick={() => setAwbGenerated(true)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                scannedSkus.length === cart.length
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4" /> Generate 4x6 Thermal AWB Shipping Label
            </button>
          </div>

          {/* Generated Thermal Label Preview */}
          {awbGenerated && (
            <div className="mt-4 p-5 rounded-xl bg-white text-slate-950 font-mono space-y-2 max-w-md mx-auto shadow-2xl border-4 border-slate-900 text-xs">
              <div className="flex justify-between items-center border-b-2 border-slate-950 pb-2">
                <span className="font-black text-sm">DELHIVERY SURFACE</span>
                <span className="text-[10px] font-bold">EXPEDITED GROUND</span>
              </div>
              <div className="py-2 text-center">
                <span className="text-lg font-black tracking-widest block">AWB: 894102948210</span>
                <div className="w-full h-10 bg-slate-950 my-1 flex items-center justify-center text-white text-[10px]">
                  |||||| ||||| ||||||| |||| |||||||| |||||||
                </div>
              </div>
              <div className="text-[11px] border-t border-slate-900 pt-2 space-y-1">
                <div><strong>To:</strong> {b2bOrgName}</div>
                <div><strong>Pincode:</strong> {destinationPincode}</div>
                <div><strong>Weight:</strong> {shippingResult.billableWeightGrams}g</div>
              </div>
              {shippingResult.containsHazmatBattery && (
                <div className="mt-2 p-2 bg-red-600 text-white font-black text-center text-[10px] uppercase tracking-wider rounded">
                  ⚠️ DANGEROUS GOODS: LITHIUM BATTERY (UN3480) - GROUND ONLY
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
