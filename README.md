# Robotics Parts & Kits E-Commerce Platform

A direct-inventory e-commerce platform dedicated to robotics components, sub-assemblies, and educational/maker starter kits.

## 📋 Project Documentation Suite

1. **Business Requirements Document (BRD):** [Robotics_Ecommerce_BRD.md](./Robotics_Ecommerce_BRD.md)
   - Product taxonomy & parametric specifications
   - Direct inventory warehousing (WMS) & bin location tracking
   - Hybrid checkout workflows (B2C instant UPI/Cards & B2B RFQ / Net-30 credit terms)
   - Hazardous materials compliance (UN3480 / UN3481 Lithium battery surface ground shipping)
   - Statutory tax compliance (HSN codes, CGST/SGST/IGST, B2B e-invoicing)
   - 7-Day DOA Return Merchandise Authorization (RMA) policies

2. **Product Requirements Document (PRD):** [Robotics_Ecommerce_PRD.md](./Robotics_Ecommerce_PRD.md)
   - User journeys for B2C makers and B2B institutional purchasers
   - 5 Epics with Gherkin-style Acceptance Criteria
   - Entity-relationship data schemas (ERD) & API contracts
   - Volumetric weight & battery surface logistics rules
   - UI/UX edge cases & telemetry event tracking schema

3. **Phase-by-Phase Implementation Action Plan:** [Implementation_Action_Plan.md](./Implementation_Action_Plan.md)
   - 18-week master roadmap across 9 two-week sprints
   - Detailed workstream task breakdowns (Phase 0 through Phase 6)
   - RACI team responsibility matrix & Definition of Done (DoD) per phase
   - Key engineering & operational risk mitigation strategies

## 🛠️ Planned Architecture

- **Storefront:** Next.js 15 (React) responsive web application
- **Backend / APIs:** Modular Headless Commerce Engine (Node.js)
- **Database & Cache:** PostgreSQL & Redis
- **Payment Gateways:** UPI 2.0 (Dynamic QR / Intent), Credit/Debit Cards (3DS), Net Banking
- **Logistics Integration:** Regional courier APIs (Delhivery, Shiprocket, BlueDart) with automated AWB generation and milestone webhooks

## 📄 License
Private / Proprietary
