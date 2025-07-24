import Reports from "@/components/reports";

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Laporan & Analisis</h1>
        <p className="text-gray-600 dark:text-gray-300">Lihat laporan dan riwayat transaksi zakat, infaq & shadaqoh</p>
      </div>
      
      <Reports />
    </div>
  );
}