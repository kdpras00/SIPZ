import PaymentNotifications from "@/components/payment-notifications";

export default function Notifications() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifikasi & Pengingat</h1>
        <p className="text-gray-600 dark:text-gray-300">Kelola pengingat zakat dan notifikasi pembayaran</p>
      </div>
      
      <PaymentNotifications />
    </div>
  );
}