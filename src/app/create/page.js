'use client';

import { useState } from 'react';

export default function CreatePostPage() {
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

 
  const handleUpload = () => {
    setIsUploading(true);
    // Setelah 3 detik, status upload jadi selesai
    setTimeout(() => {
      setIsUploading(false);
      alert("Post shared successfully!"); 
    }, 3000);
  };

  return (
    <div className="w-full flex justify-center py-6">
      <div className="w-full max-w-[720px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-slate-900 text-base font-bold">Create New Post</h1>
          
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className={`font-bold text-sm transition-colors ${isUploading ? 'text-slate-400' : 'text-[#137fec] hover:text-blue-700'}`}
          >
            {isUploading ? 'Sharing...' : 'Share'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Upload Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 border-r border-slate-100 group cursor-pointer hover:bg-blue-50/30 transition-colors">
            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-10 group-hover:border-[#137fec]/50">
              <div className="mb-6 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#137fec]">
                <span className="text-3xl">🖼️</span>
              </div>
              <h3 className="text-slate-900 text-lg font-semibold mb-2 text-center text-sm md:text-base">Drag photos here</h3>
              
              {/* 2. Tombol Select Files yang sudah dimodifikasi */}
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className={`text-white px-4 py-2 rounded-lg text-sm font-bold mt-4 active:scale-95 transition-all shadow-md ${
                  isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#137fec] hover:bg-blue-600 shadow-blue-100'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin text-lg">⏳</span> Uploading...
                  </span>
                ) : "Select Files"}
              </button>

            </div>
          </div>

          {/* Details Area */}
          <div className="w-full md:w-80 flex flex-col p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <span className="text-sm font-bold">jrossi</span>
            </div>

            <textarea 
              className="w-full h-48 border-none focus:ring-0 p-0 text-sm placeholder:text-slate-400 bg-transparent resize-none" 
              placeholder="Write a caption..."
              value={caption}
              disabled={isUploading}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}