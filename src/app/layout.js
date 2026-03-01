"use client";
import { usePathname } from 'next/navigation'; 
import Sidebar from "@/components/Sidebar";
import Suggestions from "@/components/Suggestions"; 
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  return (
    <html lang="en">
      <body className="bg-[#f6f7f8] antialiased">
        {isLoginPage ? (
          
          <main>{children}</main>
        ) : (
          <div className="flex min-h-screen">
            {/* 1. Sidebar Kiri */}
            <div className="hidden md:block w-64 fixed h-full z-50 bg-white border-r border-slate-200">
              <Sidebar />
            </div>

            {/* 2. Konten Utama */}
            <main className="flex-1 md:pl-64 flex justify-center">
              <div className="flex w-full max-w-[1200px] gap-10 py-8 px-6">
                
                {/* Kolom Tengah (Feed/Content) */}
                <div className="flex-1 max-w-[680px] w-full">
                  {children}
                </div>

                {/* 3. Kolom Suggestions (Kanan) */}
                <aside className="hidden lg:block w-[350px] shrink-0">
                  <div className="sticky top-8">
                    <Suggestions />
                  </div>
                </aside>

              </div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}