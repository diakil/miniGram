'use client';

import React, { useState } from 'react';
import { likePost, unlikePost, createComment, deleteComment } from '@/utils/api';

const INITIAL_POSTS = [
  {
    id: 1,
    user: 'elena_visuals',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
    totalLikes: 1248, 
    isLiked: false,   
    caption: 'The silence of the peaks. A morning to remember in the high Alps.',
    time: '2 HOURS AGO',
    aspect: 'aspect-[4/5]'
  },
  {
    id: 2,
    user: 'urban_forms',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    totalLikes: 892,
    isLiked: false,
    caption: 'Geometry is the secret language of the city.',
    time: '5 HOURS AGO',
    aspect: 'aspect-square'
  }
];

export default function Feed() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [loadingStates, setLoadingStates] = useState({});
  const [commentInputs, setCommentInputs] = useState({}); 
  const [isSubmittingComment, setIsSubmittingComment] = useState({});


  const handleToggleLike = async (postId, currentIsLiked) => {
    if (loadingStates[postId]) return;

    // 1. OPTIMISTIC UPDATE 
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !currentIsLiked,
          totalLikes: currentIsLiked ? p.totalLikes - 1 : p.totalLikes + 1
        };
      }
      return p;
    }));

    setLoadingStates(prev => ({ ...prev, [postId]: true }));

    try {
      // 2. PANGGIL API
      if (currentIsLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (err) {
      // 3. ROLLBACK JIKA ERROR 
      console.error("Gagal update like:", err);
      setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: currentIsLiked,
            totalLikes: currentIsLiked ? p.totalLikes + 1 : p.totalLikes - 1
          };
        }
        return p;
      }));
      alert("Terjadi masalah saat nge-like postingan.");
    } finally {
      setLoadingStates(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await createComment({ postId, comment: commentText });
      
      if (res && res.data) {
        // Update posts lokal dengan komentar baru
        setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), res.data] 
            };
          }
          return p;
        }));
      
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      alert("Gagal mengirim komentar");
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!confirm("Hapus komentar ini?")) return;

    try {
      await deleteComment(commentId);
     
      setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          };
        }
        return p;
      }));
    } catch (err) {
      alert("Gagal menghapus komentar");
    }
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto py-8">
      {posts.map((post) => (
        <article 
          key={post.id} 
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-100" />
              <span className="font-semibold text-sm tracking-tight text-black">
                {post.user}
              </span>
            </div>
            <span className="text-slate-400 font-bold cursor-pointer">•••</span>
          </div>

          {/* Image */}
          <div className={`${post.aspect} bg-slate-100 overflow-hidden relative`}>
            <img 
              src={post.image} 
              alt="post" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Actions + Caption */}
          <div className="px-5 py-4 space-y-3">
            
            <div className="flex justify-between items-center">
              <div className="flex gap-5">
                {/* TOMBOL LIKE */}
                <button 
                  onClick={() => handleToggleLike(post.id, post.isLiked)}
                  className={`transition-all active:scale-90 hover:scale-110 ${loadingStates[post.id] ? 'opacity-50' : ''}`}
                >
                  {post.isLiked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" className="w-7 h-7">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#334155" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )}
                </button>
                <span className="text-2xl cursor-pointer hover:scale-110 transition">💬</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition">📤</span>
              </div>
              <span className="text-2xl hover:scale-110 transition cursor-pointer">🔖</span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-black">
                {post.totalLikes.toLocaleString()} likes
              </p>

              <p className="text-sm text-slate-700 leading-relaxed">
                <span className="font-bold mr-2 text-black">
                  {post.user}
                </span>
                {post.caption}
              </p>

              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide pt-1">
                {post.time}
              </p>
            </div>

            {/* --- DISPLAY KOMENTAR --- */}
            {post.comments?.length > 0 && (
              <div className="mt-4 space-y-2 max-h-32 overflow-y-auto pt-2 border-t border-slate-50">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="group flex justify-between items-start text-sm">
                    <p className="text-slate-700">
                      <span className="font-bold mr-2 text-black">{comment.user?.username || 'user'}</span>
                      {comment.comment}
                    </p>
                    {/* Tombol Delete hanya muncul jika itu komentar milik kita/sesuai kebijakan API */}
                    <button 
                      onClick={() => handleDeleteComment(post.id, comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity text-[10px]"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* --- INPUT KOMENTAR --- */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
              <input 
                type="text"
                placeholder="Tambahkan komentar..."
                className="flex-1 text-sm outline-none bg-transparent text-black"
                value={commentInputs[post.id] || ""}
                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
              />
              <button 
                onClick={() => handleAddComment(post.id)}
                disabled={isSubmittingComment[post.id] || !commentInputs[post.id]?.trim()}
                className="text-[#137fec] font-bold text-sm disabled:opacity-30"
              >
                {isSubmittingComment[post.id] ? "..." : "Post"}
              </button>
            </div>

          </div>

        </article>
      ))}
    </div>
  );
}
