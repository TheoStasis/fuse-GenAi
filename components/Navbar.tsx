"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Sparkles, LogOut } from "lucide-react";

interface NavbarProps {
  isSignedIn?: boolean;
}

export default function Navbar({ isSignedIn = false }: NavbarProps) {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
      <div className="flex items-center justify-between px-6 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-bold text-white tracking-wide">FUSE</span>
        </Link>

        {/* Links Section */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          {isSignedIn && (
            <>
              <Link href="../history" className="hover:text-white transition-colors">History</Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500/20 px-4 py-2 rounded-full hover:bg-red-500/30 transition-all flex items-center gap-2 border border-red-500/50 hover:border-red-500 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}