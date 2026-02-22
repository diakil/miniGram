'use client';

import React from 'react';
import Link from 'next/link';

// Data Dummy untuk Gallery
const POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', likes: '2.4k', comments: '82' },
  { id: 2, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', likes: '1.8k', comments: '45' },
  { id: 3, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', likes: '3.1k', comments: '104' },
  { id: 4, image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482', likes: '920', comments: '22' },
  { id: 5, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', likes: '4.5k', comments: '156' },
  { id: 6, image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', likes: '1.2k', comments: '31' },
];

export default function ProfilePage() {
  return (
    <div className="bg-[#f6f7f8] min-h-screen text-slate-900 font-sans">
      {/* Navbar Profil */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#137fec] p-1.5 rounded-lg text-white">📷</div>
            <span className="text-xl font-bold tracking-tight">Aura</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/create">
                <button className="bg-[#137fec] text-white px-4 py-1.5 rounded-lg font-bold text-sm">
                 + Upload
                </button>
            </Link>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-transparent hover:border-[#137fec] cursor-pointer transition-all" />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16 px-4">
          <div className="size-32 md:size-44 rounded-full p-1 bg-gradient-to-tr from-[#137fec] to-purple-500">
            <div className="w-full h-full rounded-full border-4 border-white bg-slate-200 overflow-hidden" />
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">elara_visuals</h1>
              <div className="flex gap-3 justify-center">
                <button className="bg-[#137fec] text-white px-8 py-2 rounded-lg font-bold text-sm">Follow</button>
                <button className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-sm">Message</button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-10 py-4 md:py-0 border-y border-slate-100 md:border-none">
              <Stat count="184" label="posts" />
              <Stat count="12.8k" label="followers" />
              <Stat count="492" label="following" />
            </div>

            {/* Bio */}
            <div className="max-w-md">
              <p className="font-semibold">Elara Thorne</p>
              <p className="text-slate-600 text-sm leading-relaxed mt-1">
                Multidisciplinary visual artist specializing in high-contrast urban landscapes.
              </p>
              <a href="#" className="text-[#137fec] text-sm font-semibold mt-2 inline-block">🔗 elarathorne.studio</a>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-t border-slate-200 mb-8">
          <div className="flex justify-center gap-12 -mt-px">
            <TabButton label="POSTS" active />
            <TabButton label="SAVED" />
            <TabButton label="TAGGED" />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-8">
          {POSTS.map((post) => (
            <div key={post.id} className="relative aspect-square group overflow-hidden bg-slate-200 rounded-lg cursor-pointer">
              <img 
                src={post.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt="Gallery Item" 
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                <div className="flex items-center gap-2">❤️ {post.likes}</div>
                <div className="flex items-center gap-2">💬 {post.comments}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center py-8 border-t border-slate-100 text-slate-400 text-xs">
          <div className="flex justify-center gap-8 mb-4 font-semibold uppercase tracking-widest">
            <a href="#" className="hover:text-[#137fec]">About</a>
            <a href="#" className="hover:text-[#137fec]">Help</a>
            <a href="#" className="hover:text-[#137fec]">Privacy</a>
          </div>
          <p>© 2024 Aura Visual Gallery.</p>
        </div>
      </main>
    </div>
  );
}

// Sub-components
function Stat({ count, label }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-1">
      <span className="font-bold text-lg">{count}</span>
      <span className="text-slate-500 text-sm">{label}</span>
    </div>
  );
}

function TabButton({ label, active }) {
  return (
    <button className={`py-4 border-t-2 font-bold text-xs tracking-widest transition-colors ${
      active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}>
      {label}
    </button>
  );
}