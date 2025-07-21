import { Church } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-islamic-700 to-islamic-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-6">
            <Church className="mx-auto text-4xl text-islamic-300 mb-4 h-12 w-12" />
            <h3 className="text-2xl font-bold mb-2">SIPZ</h3>
            <p className="text-islamic-200">Sistem Informasi Pengelolaan Zakat</p>
          </div>

          <div className="bg-islamic-600 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <p className="text-lg italic mb-2">"Dan dirikanlah shalat dan tunaikanlah zakat..."</p>
            <p className="text-sm text-islamic-200">QS. Al-Baqarah: 43</p>
          </div>

          <div className="border-t border-islamic-600 pt-6">
            <p className="text-islamic-200 text-sm">
              © 2024 SIPZ. Dibuat dengan ❤️ untuk kemudahan beribadah.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
