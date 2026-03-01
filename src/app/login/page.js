'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/utils/api'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await loginUser(email, password);
      
      if (res.status === "OK" || res.code === "200" || res.token) {
        localStorage.setItem('token', res.token || res.data?.token);
        
        alert("Login Berhasil!");
        
        router.push('/'); 
      } else {
        alert(res.message || "Login gagal, periksa kembali data kamu");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Terjadi kesalahan koneksi ke server");
    }
  };

  
  return (
    <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center p-4 font-sans text-black">
      <div className="w-full max-w-[350px] space-y-3">
        <div className="bg-white border border-slate-200 p-8 flex flex-col items-center shadow-sm">
          <h1 className="text-3xl font-bold text-blue-600 mb-8 tracking-tighter italic">Minigram</h1>
          
          <form onSubmit={handleLogin} className="w-full space-y-2 text-black">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 rounded text-sm transition-colors mt-2 active:scale-95"
            >
              Log In
            </button>
          </form>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <div className="px-4 text-xs font-bold text-slate-400 uppercase">OR</div>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <button className="text-[#385185] text-sm font-bold flex items-center gap-2 hover:opacity-70 transition-opacity">
            Log in with Facebook
          </button>
          
          <p className="text-xs text-[#385185] mt-4 cursor-pointer hover:underline">Forgot password?</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 text-center shadow-sm text-black">
          <p className="text-sm">
            Don't have an account? <Link href="/signup" className="text-blue-500 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}