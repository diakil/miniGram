// Kita pakai 'use client' supaya tombolnya bisa diklik (interaktif)
'use client';

export default function HomePage() {
  
  const handleAlert = () => {
    alert("Halo! Lo baru aja nge-klik tombol di Next.js!");
  };

  return (
    <div style={styles.container}>
      {/* --- NAVBAR --- */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>BrandGue</h1>
        <ul style={styles.navLinks}>
          <li>Beranda</li>
          <li>Tentang</li>
          <li>Kontak</li>
        </ul>
      </nav>

      {/* --- HERO SECTION --- */}
      <header style={styles.hero}>
        <h2 style={styles.title}>Selamat Datang di Website Pertama Gue</h2>
        <p style={styles.subtitle}>Bikin website pakai Next.js ternyata sat-set juga ya.</p>
        <button style={styles.button} onClick={handleAlert}>
          Klik Gue!
        </button>
      </header>

      {/* --- FOOTER --- */}
      <footer style={styles.footer}>
        <p>&copy; 2026 - Dibuat dengan semangat ngoding 🔥</p>
      </footer>
    </div>
  );
}

// --- CSS (JavaScript Object Style) ---
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    color: '#333',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#0070f3',
    color: 'white',
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold' },
  navLinks: {
    display: 'flex',
    gap: '20px',
    listStyle: 'none',
    cursor: 'pointer',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: { fontSize: '3rem', marginBottom: '10px' },
  subtitle: { fontSize: '1.2rem', marginBottom: '20px', color: '#666' },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#333',
    color: 'white',
  }
};