import InfaqForm from "@/components/infaq-form";

export default function Infaq() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Infaq & Shadaqoh</h1>
        <p className="text-gray-600 dark:text-gray-300">Rekam amal jariyah dan sedekah Anda</p>
      </div>
      
      <InfaqForm />
    </div>
  );
}