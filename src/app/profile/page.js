'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser, getMyPosts, getLoggedUser, deletePost, updatePost } from '@/utils/api';

export default function ProfilePage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  const openModal = (post) => {
    setSelectedPost(post);
    setEditCaption(post.caption || "");
    setIsEditing(false); // Reset mode edit tiap buka modal
  };

  const handleUpdate = async () => {
  if (!editCaption.trim()) return alert("Caption tidak boleh kosong");
  
  setIsUpdating(true);
  try {
    // KIRIM KEDUANYA: caption baru DAN imageUrl lama
    const res = await updatePost(selectedPost.id, { 
      caption: editCaption,
      imageUrl: selectedPost.imageUrl // Tambahkan ini agar tidak kena BAD_REQUEST
    });

    if (res) {
      // Update state posts agar UI sinkron
      setPosts(prevPosts => prevPosts.map(p => 
        p.id === selectedPost.id ? { ...p, caption: editCaption } : p
      ));
      
      // Update data di modal yang sedang terbuka
      setSelectedPost(prev => ({ ...prev, caption: editCaption }));
      
      setIsEditing(false);
      alert("Postingan berhasil diperbarui! ✨");
    }
  } catch (err) {
    console.error("Detail Error Update:", err);
    alert(`Gagal Update: ${err.message}`);
  } finally {
    setIsUpdating(false);
  }
};

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);
        // Load User (Hanya sekali saja atau setiap page load)
        const resUser = await getLoggedUser();
        if (resUser && resUser.data) setUser(resUser.data);
        
        // Fetch posts berdasarkan page yang aktif
        fetchPosts(currentPage);
      } catch (err) {
        console.error("Gagal load data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchPosts = async (page) => {
    setIsLoading(true);
    try {
      const resPosts = await getMyPosts(pageSize, page);
      if (resPosts && resPosts.data) {
        setPosts(resPosts.data.posts || []);
        setTotalPages(resPosts.data.totalPages || 1); 
      }
    } catch (err) {
      console.error("Gagal load posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (confirm("Apakah kamu yakin ingin menghapus postingan ini secara permanen?")) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
        setSelectedPost(null); // Tutup modal setelah delete
        if (posts.length === 1 && currentPage > 1) {
          handlePageChange(currentPage - 1);
        }
      } catch (err) {
        alert("Gagal menghapus post");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchPosts(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas saat ganti page
    }
  };

  const handleLogout = async () => {
    if (confirm("Apakah kamu yakin ingin logout?")) {
      try {
        await logoutUser();
        localStorage.removeItem('token');
        router.push('/login');
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  // Perbaikan Error Empty String: Cek apakah user ada sebelum render image
  const profileImage = user?.profilePictureUrl || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  return (
    <div className="bg-[#f6f7f8] min-h-screen text-slate-900 font-sans">
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#137fec] p-1.5 rounded-lg text-white">📷</div>
            <span className="text-xl font-bold tracking-tight text-black">Aura</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/create">
                <button className="bg-[#137fec] text-white px-4 py-1.5 rounded-lg font-bold text-sm">+ Upload</button>
            </Link>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors">Logout</button>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-transparent hover:border-[#137fec] cursor-pointer transition-all ml-2" />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16 px-4">
          <div className="size-32 md:size-44 rounded-full p-1 bg-gradient-to-tr from-[#137fec] to-purple-500">
            <div className="w-full h-full rounded-full border-4 border-white bg-slate-200 overflow-hidden">
               {!isLoading && <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />}
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left text-black">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{user?.username || "elara_visuals"}</h1>
              <div className="flex gap-3 justify-center">
                <button className="bg-[#137fec] text-white px-8 py-2 rounded-lg font-bold text-sm">Follow</button>
                <button className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-sm">Message</button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-10 py-4 md:py-0 border-y border-slate-100 md:border-none">
              <Stat count={posts.length} label="posts" />
              <Stat count={user?.totalFollowers || "12.8k"} label="followers" />
              <Stat count={user?.totalFollowing || "492"} label="following" />
            </div>

            <div className="max-w-md text-black">
              <p className="font-semibold">{user?.name || "Elara Thorne"}</p>
              <p className="text-slate-600 text-sm leading-relaxed mt-1">
                {user?.bio || "Multidisciplinary visual artist specializing in high-contrast urban landscapes."}
              </p>
              <a href="#" className="text-[#137fec] text-sm font-semibold mt-2 inline-block">🔗 {user?.website || "elarathorne.studio"}</a>
            </div>
          </div>
        </header>
        <div className="border-t border-slate-200 mb-8">
          <div className="flex justify-center gap-12 -mt-px">
            <TabButton label="POSTS" active />
            <TabButton label="SAVED" />
            <TabButton label="TAGGED" />
          </div>
        </div>
<div className="grid grid-cols-3 gap-1 md:gap-8">
          {posts.map((post) => (
            <div key={post.id} onClick={() => openModal(post)}
              className="relative aspect-square group overflow-hidden bg-slate-200 rounded-lg cursor-pointer"
            >
              <img src={post.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                ❤️ {post.totalLikes || 0}
              </div>
            </div>
          ))}
        </div>
      </main>
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
            
            {/* Kiri: Gambar */}
            <div className="md:w-3/5 bg-black flex items-center justify-center">
              <img src={selectedPost.imageUrl} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Kanan: Info & Form */}
            <div className="md:w-2/5 flex flex-col bg-white">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={profileImage} className="w-8 h-8 rounded-full border" />
                  <span className="font-bold text-sm text-black">{user?.username}</span>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-slate-400 hover:text-black">✕</button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                {isEditing ? (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">Edit Caption</label>
                    <textarea 
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-[#137fec] outline-none min-h-[120px] text-black"
                      placeholder="Tulis caption baru..."
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-800">
                    <span className="font-bold mr-2 text-black">{user?.username}</span>
                    {selectedPost.caption || "No caption."}
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="p-4 bg-slate-50 border-t space-y-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="flex-1 bg-[#137fec] text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border rounded-lg font-bold text-sm text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 flex items-center justify-center gap-2"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedPost.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-sm hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>  
      )}
    </div>
  );
}

function Stat({ count, label }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-1">
      <span className="font-bold text-lg text-black">{count}</span>
      <span className="text-slate-500 text-sm">{label}</span>
    </div>
  );
}

function TabButton({ label, active }) {
  return (
    <button className={`py-4 border-t-2 font-bold text-xs tracking-widest transition-colors ${
      active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}>{label}</button>
  );
}