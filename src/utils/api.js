const API_URL = 'https://photo-sharing-api-bootcamp.do.dibimbing.id';
const API_KEY = 'c7b411cc-0e7c-4ad1-aa3f-822b00e7734b';

// --- Fungsi untuk Login ---

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': process.env.NEXT_PUBLIC_API_KEY
    },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const deletePost = async (postId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/v1/delete-post/${postId}`, {
    method: 'DELETE',
    headers: {
      'apiKey': API_KEY,
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};


// --- Fungsi untuk Logout ---
export const logoutUser = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/api/v1/logout`, {
    method: 'GET',
    headers: {
      'apiKey': process.env.NEXT_PUBLIC_API_KEY,
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};


// --- Fungsi untuk Create Post ---

// 1. Fungsi untuk upload file gambar ke server 
export const uploadImage = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/v1/upload-image`, {
    method: 'POST',
    headers: {
      'apiKey': API_KEY,
      'Authorization': `Bearer ${token}`
    },
    body: formData 
  });
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  return response.json();
};

export const updatePost = async (postId, data) => {
  const token = localStorage.getItem('token');
  
  // LOG: Cek apa yang dikirim
  console.log("Updating post:", postId, "with data:", data);

  const response = await fetch(`${API_URL}/api/v1/update-post/${postId}`, {
    method: 'POST', // <-- COBA GANTI KE 'PUT' JIKA POST GAGAL
    headers: {
      'Content-Type': 'application/json',
      'apiKey': API_KEY,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data) 
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || "Gagal update dari server");
  }

  return result;
};

export const createPost = async (imageUrl, caption) => {
  const token = localStorage.getItem('token'); 
  
  const response = await fetch(`${API_URL}/api/v1/create-post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': API_KEY, 
      'Authorization': `Bearer ${token}`
    },
    
    body: JSON.stringify({
      imageUrl: imageUrl, 
      caption: caption || "" 
    })
  });

  
  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes("jwt malformed")) {
       throw new Error("Sesi login kamu rusak (JWT malformed). Silakan logout dan login kembali.");
    }
    throw new Error("Gagal membuat post di server.");
  }
  
  return response.json();
};

// Fungsi untuk ambil data user yang sedang login (biar muncul nama Miftah Farhan)
export const getLoggedUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/v1/user`, {
    method: 'GET',
    headers: {
      'apiKey': API_KEY,
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};


// Fungsi untuk ambil semua post milik kita sendiri
export const getMyPosts = async (size = 10, page = 1) => {
  const token = localStorage.getItem('token');
  
  // 1. Kita ambil dulu data user kita untuk dapat ID-nya
  const userRes = await getLoggedUser();
  const userId = userRes.data.id; 

  // 2. Tembak alamat yang BENAR sesuai Postman kamu
  // Perhatikan: /api/v1/users-post/ (tanpa 's' di kata post)
  const response = await fetch(`${API_URL}/api/v1/users-post/${userId}?size=${size}&page=${page}`, { 
    method: 'GET',
    headers: {
      'apiKey': API_KEY,
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.error("Masih error 404? Cek URL ini:", response.url);
    return { data: { posts: [] } };
  }

  return response.json();
};
