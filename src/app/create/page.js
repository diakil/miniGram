'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage, createPost } from '@/utils/api';

export default function CreatePostPage() {
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const router = useRouter();

  // 1. Fungsi saat kamu pilih foto dari galeri HP/Laptop
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Supaya fotonya muncul di layar buat preview
    }
  };

  // 2. Fungsi saat kamu klik tombol "Share"
  const handleProcessUpload = async () => {
    if (!selectedFile) return alert("Pilih foto dulu ya!");
    
    setIsUploading(true);
    try {
      // TAHAP A: Upload fotonya dulu ke server (supaya dapat link https://...)
      const formData = new FormData();
      formData.append('image', selectedFile); 
      
      const uploadRes = await uploadImage(formData);
      
      // Ambil link gambar yang dikasih sama server
      const linkGambarDariServer = uploadRes.url || uploadRes.data?.url;

      if (linkGambarDariServer) {
        // TAHAP B: Kirim link gambar & caption (persis seperti isi Postman yang kamu temukan)
        // Data yang dikirim: { "imageUrl": linkGambarDariServer, "caption": caption }
        const postRes = await createPost(linkGambarDariServer, caption);
        
        if (postRes.status === 'OK' || postRes.code === "200" || postRes.id) {
          alert("Berhasil Posting!");
          router.push('/profile'); // Pindah ke profil buat lihat hasilnya
        }
      } else {
        alert("Gagal mendapatkan link gambar dari server.");
      }
    } catch (err) {
      // Kalau error "JWT Malformed", berarti token kamu rusak.
      alert("Error: " + err.message);
      if (err.message.includes("Sesi login")) {
        router.push('/login'); // Suruh login ulang
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-6">
      {/* Input rahasia untuk buka galeri */}
      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />

      <div className="w-full max-w-[720px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Navbar Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-sm font-medium text-slate-400">Cancel</button>
          <h1 className="text-slate-900 text-base font-bold">Create New Post</h1>
          <button 
            onClick={handleProcessUpload}
            disabled={isUploading || !selectedFile}
            className={`font-bold text-sm ${isUploading || !selectedFile ? 'text-slate-300' : 'text-[#137fec]'}`}
          >
            {isUploading ? 'Sharing...' : 'Share'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Area Foto (Kiri) */}
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 border-r border-slate-100 cursor-pointer"
          >
            {previewImage ? (
              <img src={previewImage} className="max-w-full max-h-[400px] object-contain shadow-md rounded-lg" alt="Preview" />
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">🖼️</div>
                <p className="text-slate-500 mb-4 text-sm">Klik untuk pilih foto dari galeri</p>
                <button className="bg-[#137fec] text-white px-4 py-2 rounded-lg font-bold text-sm">Select Photo</button>
              </div>
            )}
          </div>

          {/* Area Caption (Kanan) */}
          <div className="w-full md:w-80 p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-full bg-slate-200" />
               <span className="text-sm font-bold text-black">User_Baru</span>
            </div>
            <textarea 
              className="w-full h-48 border-none focus:ring-0 p-0 text-sm resize-none text-black" 
              placeholder="Tulis caption di sini (seperti 'Pengen Ayam')..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}