import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoboParts Direct | Robotics Components & Starter Kits',
  description: 'Direct-inventory robotics parts e-commerce platform with live stock counts, parametric component selection, and hybrid B2C/B2B purchasing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 lg:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter">
                RP
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">RoboParts Direct</span>
                <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono border border-sky-500/20">
                  Verified WMS Inventory
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href="#catalog" className="text-slate-300 hover:text-white transition">Catalog</a>
              <a href="#b2b-rfq" className="text-slate-300 hover:text-white transition">B2B & RFQ Portal</a>
              <a href="#wms-station" className="text-slate-300 hover:text-white transition">WMS Packing App</a>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-800 bg-slate-900/50 py-8 px-4 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 RoboParts Direct. Regional Warehouse Fulfillment Hub.</p>
            <div className="flex items-center gap-4">
              <span>UN3480/3481 Surface Logistics Certified</span>
              <span>•</span>
              <span>7-Day DOA Electronic Warranty</span>
              <span>•</span>
              <span>GST Input Credit Supported</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
