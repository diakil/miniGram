'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser, getMyPosts, getLoggedUser, deletePost, updatePost, likePost, unlikePost } from '@/utils/api';

export default function ProfilePage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  const openModal = (post) => {
    setSelectedPost(post);
    setEditCaption(post.caption || "");
    setIsEditing(false); 
  };

  const handleUpdate = async () => {
  if (!editCaption.trim()) return alert("Caption tidak boleh kosong");
  
  setIsUpdating(true);
  try {
    // KIRIM KEDUANYA: caption baru DAN imageUrl lama
    const res = await updatePost(selectedPost.id, { 
      caption: editCaption,
      imageUrl: selectedPost.imageUrl 
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
        // Load User 
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
        setSelectedPost(null); 
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
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
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


const handleToggleLike = async (postId) => {
  if (isLiking) return;
  const isCurrentlyLiked = selectedPost.isLiked; 

  setIsLiking(true);
  try {
    // Panggil API sesuai status saat ini
    const res = isCurrentlyLiked ? await unlikePost(postId) : await likePost(postId);
    
    if (res) {
      const newLikeStatus = !isCurrentlyLiked;
      const adjustment = newLikeStatus ? 1 : -1;

      
      setPosts(prevPosts => prevPosts.map(p => 
        p.id === postId ? { 
          ...p, 
          totalLikes: Math.max(0, (p.totalLikes || 0) + adjustment),
          isLiked: newLikeStatus 
        } : p
      ));

      
      setSelectedPost(prev => ({
        ...prev,
        totalLikes: Math.max(0, (prev.totalLikes || 0) + adjustment),
        isLiked: newLikeStatus
      }));
    }
  } catch (err) {
    console.error("Gagal mengubah status like:", err);
  } finally {
    setIsLiking(false);
  }
};


  const handleAddComment = async () => {
  if (!commentText.trim()) return;
  setIsSubmittingComment(true);
  try {
    const res = await createComment(selectedPost.id, commentText);
    if (res && res.data) {
      
      setSelectedPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), res.data]
      }));
      setCommentText(""); 
    }
  } catch (err) {
    alert("Gagal menambahkan komentar");
  } finally {
    setIsSubmittingComment(false);
  }
};

const handleDeleteComment = async (commentId) => {
  if (!confirm("Hapus komentar ini?")) return;
  try {
    await deleteComment(commentId);
    setSelectedPost(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c.id !== commentId)
    }));
  } catch (err) {
    alert("Gagal menghapus komentar");
  }
};
  
  // Perbaikan Error Empty String
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
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
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

              {/* Bagian Like di dalam Modal */}
              <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleToggleLike(selectedPost.id)}
                    disabled={isLiking}
                    className={`hover:scale-110 transition-transform active:scale-90 ${isLiking ? 'opacity-50' : 'opacity-100'}`}
                  >
              {/* SVG dinamis berdasarkan status selectedPost.isLiked */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 transition-colors" 
                fill={selectedPost.isLiked ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={selectedPost.isLiked ? "0" : "2"}
                style={{ color: selectedPost.isLiked ? '#ef4444' : '#64748b' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
                    </button>
                <span className="font-bold text-sm text-black">{selectedPost.totalLikes || 0} Likes</span>
              </div>
              {}
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