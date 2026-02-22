const POSTS = [
  {
    id: 1,
    user: 'elena_visuals',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
    likes: '1,248',
    caption: 'The silence of the peaks. A morning to remember in the high Alps.',
    time: '2 HOURS AGO',
    aspect: 'aspect-[4/5]'
  },
  {
    id: 2,
    user: 'urban_forms',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    likes: '892',
    caption: 'Geometry is the secret language of the city.',
    time: '5 HOURS AGO',
    aspect: 'aspect-square'
  }
];

export default function Feed() {
  return (
    <div className="space-y-8">
      {POSTS.map((post) => (
        <article 
          key={post.id} 
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              <span className="font-semibold text-sm tracking-tight">
                {post.user}
              </span>
            </div>
            <span className="text-slate-400 font-bold cursor-pointer">•••</span>
          </div>

          {/* Image */}
          <div className={`${post.aspect} bg-slate-100 overflow-hidden`}>
            <img 
              src={post.image} 
              alt="post" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Actions + Caption */}
          <div className="px-5 py-4 space-y-3">
            
            <div className="flex justify-between text-lg">
              <div className="flex gap-5 cursor-pointer">
                <span className="hover:scale-110 transition">❤️</span>
                <span className="hover:scale-110 transition">💬</span>
                <span className="hover:scale-110 transition">📤</span>
              </div>
              <span className="hover:scale-110 transition cursor-pointer">🔖</span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {post.likes} likes
              </p>

              <p className="text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold mr-2">
                  {post.user}
                </span>
                {post.caption}
              </p>

              <p className="text-[11px] text-slate-400 uppercase tracking-wide pt-1">
                {post.time}
              </p>
            </div>

          </div>

        </article>
      ))}
    </div>
  );
}