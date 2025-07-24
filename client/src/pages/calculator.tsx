import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ZakatCalculator from "@/components/zakat-calculator";

export default function Calculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kalkulator Zakat</h1>
          <p className="text-gray-600">Hitung zakat Anda sesuai syariat Islam</p>
        </div>
        
        <ZakatCalculator />
      </main>

      <Footer />
    </div>
  );
}