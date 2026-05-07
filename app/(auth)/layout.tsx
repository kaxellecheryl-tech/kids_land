import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDF8F8] flex flex-col">
      <header className="h-16 flex items-center px-6 border-b border-gray-100 bg-white">
        <Link href="/">
          <Image
            src="/LOGO.png"
            alt="Kids Land"
            width={180}
            height={72}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-5 text-center text-[12px] text-gray-400 border-t border-gray-100 bg-white">
        © {new Date().getFullYear()} Kids Land — Tous droits réservés
      </footer>
    </div>
  );
}
