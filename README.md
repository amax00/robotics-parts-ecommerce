# Robotics Parts & Kits E-Commerce Platform

A direct-inventory e-commerce platform dedicated to robotics components, sub-assemblies, and educational/maker starter kits.

## 📋 Documentation

- **Business Requirements Document (BRD):** [Robotics_Ecommerce_BRD.md](./Robotics_Ecommerce_BRD.md)
  - Detailed product taxonomy & parametric specifications
  - Direct inventory warehousing (WMS) & bin location tracking
  - Hybrid checkout workflows (Instant B2C UPI/Card payments & B2B Request for Quote / Net-30 credit terms)
  - Specialized logistics & hazardous materials compliance (UN3480 / UN3481 Lithium battery ground shipping)
  - Statutory tax compliance (HSN codes, CGST/SGST/IGST, B2B e-invoicing)
  - 7-Day DOA Return Merchandise Authorization (RMA) policies

## 🛠️ Planned Architecture

- **Storefront:** Next.js (React) responsive web application
- **Backend / APIs:** Microservices / Modular Headless Commerce Engine
- **Database & Cache:** PostgreSQL & Redis
- **Payment Gateways:** UPI 2.0 (Dynamic QR / Intent), Credit/Debit Cards, Net Banking
- **Logistics Integration:** Regional courier APIs with automated AWB generation and milestone webhooks

## 📄 License
Private / Proprietary
