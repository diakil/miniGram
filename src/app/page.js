import Feed from '@/components/Feed';

export default function Home() {
  return (
    <div className="space-y-6">
      
      <div className="sticky top-0 bg-[#f6f7f8]/80 backdrop-blur-md py-2 z-30">
        <input 
          className="w-full bg-[#e9e9e9] border-none rounded-full py-3 px-6 outline-none focus:ring-4 focus:ring-gray-200 transition-all text-sm" 
          placeholder="Cari inspirasi..." 
          type="text"
        />
      </div>

      {/* Konten Utama */}
      <Feed />
    </div>
  );
}