import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Reports from "@/components/reports";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan & Analisis</h1>
          <p className="text-gray-600">Lihat laporan dan riwayat transaksi zakat, infaq & shadaqoh</p>
        </div>
        
        <Reports />
      </main>

      <Footer />
    </div>
  );
}