import { Building2, Facebook, Instagram, Linkedin, Mail, Phone, Twitter, Youtube } from "lucide-react";
import { Link } from "wouter";

// Custom TikTok icon since it's not in Lucide
const TikTok = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-emerald-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Building2 className="h-8 w-8" />
              <span className="text-xl font-bold">SIPZ</span>
            </div>
            <p className="text-emerald-200 mb-4">
              Philanthropy Building<br />
              Jl. Warung Jati Barat No.14<br />
              Jakarta Selatan 12540, Indonesia
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Layanan Donatur & Mustahik</p>
              <div className="flex items-center gap-2 text-emerald-200">
                <Phone className="h-4 w-4" />
                <span>0804-100-4000 (Call Center)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <Phone className="h-4 w-4" />
                <span>(021) 508 66860 (Call Center)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <Phone className="h-4 w-4" />
                <span>WhatsApp: 628111544488</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200">
                <Mail className="h-4 w-4" />
                <span>info@sipz.org</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Tentang Kami</h3>
            <ul className="space-y-3">
              <li><Link href="/profil"><a className="text-emerald-200 hover:text-white">Profil</a></Link></li>
              <li><Link href="/program"><a className="text-emerald-200 hover:text-white">Program</a></Link></li>
              <li><Link href="/kemitraan"><a className="text-emerald-200 hover:text-white">Kemitraan Perusahaan dan Lembaga</a></Link></li>
              <li><Link href="/mitra"><a className="text-emerald-200 hover:text-white">Mitra Pengelola Zakat</a></Link></li>
              <li><Link href="/panduan"><a className="text-emerald-200 hover:text-white">Panduan Zakat</a></Link></li>
              <li><Link href="/relawan"><a className="text-emerald-200 hover:text-white">Relawan</a></Link></li>
              <li><Link href="/laporan"><a className="text-emerald-200 hover:text-white">Laporan Publik</a></Link></li>
              <li><Link href="/karir"><a className="text-emerald-200 hover:text-white">Karir</a></Link></li>
              <li><Link href="/faq"><a className="text-emerald-200 hover:text-white">FAQ</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Donasi</h3>
            <ul className="space-y-3">
              <li><Link href="/donasi-online"><a className="text-emerald-200 hover:text-white">Donasi Online</a></Link></li>
              <li><Link href="/layanan"><a className="text-emerald-200 hover:text-white">Layanan</a></Link></li>
              <li><Link href="/kalkulator"><a className="text-emerald-200 hover:text-white">Kalkulator Zakat</a></Link></li>
              <li><Link href="/rekening"><a className="text-emerald-200 hover:text-white">Rekening Donasi</a></Link></li>
              <li><Link href="/konfirmasi"><a className="text-emerald-200 hover:text-white">Konfirmasi Donasi</a></Link></li>
              <li><Link href="/login"><a className="text-emerald-200 hover:text-white">Login Donatur</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Langganan Lansiran</h3>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Email Anda"
                className="px-4 py-2 w-full text-gray-900 rounded-l-md focus:outline-none"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-r-md">
                Berlangganan
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-4">Download Aplikasi Kami</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-black text-white px-4 py-2 rounded-md text-sm flex items-center">
                Google Play
              </a>
              <a href="#" className="bg-black text-white px-4 py-2 rounded-md text-sm flex items-center">
                App Store
              </a>
            </div>

            <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-emerald-300"><Facebook size={20} /></a>
              <a href="#" className="hover:text-emerald-300"><Twitter size={20} /></a>
              <a href="#" className="hover:text-emerald-300"><Instagram size={20} /></a>
              <a href="#" className="hover:text-emerald-300"><Youtube size={20} /></a>
              <a href="#" className="hover:text-emerald-300"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-emerald-300"><TikTok /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-700 mt-10 pt-6 text-center md:text-left">
          <p className="text-emerald-200">
            © {new Date().getFullYear()} Sistem Informasi Pengelolaan Zakat. Membantu umat Muslim menjalankan kewajiban zakat dengan mudah dan tepat.
          </p>
        </div>
      </div>

      {/* WhatsApp Fixed Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/628111544488"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
      </div>
    </footer>
  );
}
