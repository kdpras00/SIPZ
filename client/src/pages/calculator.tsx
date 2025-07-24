import ZakatCalculator from "@/components/zakat-calculator";

export default function Calculator() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kalkulator Zakat</h1>
        <p className="text-gray-600 dark:text-gray-300">Hitung zakat Anda sesuai syariat Islam</p>
      </div>
      
      <ZakatCalculator />
    </div>
  );
}