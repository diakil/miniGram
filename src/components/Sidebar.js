"use client"; 
import { usePathname } from 'next/navigation';
import Link from 'next/link'

const navItems = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Create", href: "/create" },
  { name: "Profile", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname(); 

  return (
    <aside className="h-full flex flex-col justify-between bg-white">
      {/* Top Section */}
      <div>
        <div className="px-6 py-8">
          <h1 className="text-xl font-bold tracking-tight text-blue-600">
            Minigram
          </h1>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href} 
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-50" 
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-6 border-t border-slate-100">
        <Link href="/profile" className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition">
          <div className="w-9 h-9 rounded-full bg-slate-200" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Julian Rossi</p>
            <p className="text-xs text-slate-500">@jrossi</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
