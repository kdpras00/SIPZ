import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import InfaqForm from "@/components/infaq-form";

export default function Infaq() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Infaq & Shadaqoh</h1>
          <p className="text-gray-600">Rekam amal jariyah dan sedekah Anda</p>
        </div>
        
        <InfaqForm />
      </main>

      <Footer />
    </div>
  );
}