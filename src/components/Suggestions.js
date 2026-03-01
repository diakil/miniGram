
export default function Suggestions() {
  return (
    <div className="w-[320px] space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Suggested For You
        </h3>
        <button className="text-[11px] font-extrabold text-[#137fec] hover:text-blue-700 transition-colors">
          See All
        </button>
      </div>

      {/* Card Section */}
      <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 space-y-5">
        {['studio_lite', 'mark.design', 'sara_captures'].map((user) => (
          <div key={user} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Circle */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-50" />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user}</p>
                <p className="text-[11px] text-slate-400 leading-none">Suggested for you</p>
              </div>
            </div>
            <button className="bg-[#137fec] hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95">
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="px-1 text-[10px] text-slate-400 space-y-3 uppercase tracking-tighter">
        <div className="flex flex-wrap gap-x-3 gap-y-1 opacity-70">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hover:underline cursor-pointer">Press</span>
          <span className="hover:underline cursor-pointer">API</span>
          <span className="hover:underline cursor-pointer">Jobs</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
        </div>
        <p className="font-bold opacity-80 mt-2">© 2024 MINIMALIST PHOTO</p>
      </div>
    </div>
  );
}
