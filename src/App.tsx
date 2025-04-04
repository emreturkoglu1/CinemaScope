import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import { ShortFilmProvider } from './context/ShortFilmContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MediaListPage from './pages/MediaListPage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import ShortFilmsPage from './pages/ShortFilmsPage';

function App() {
  return (
    <WatchlistProvider>
      <ShortFilmProvider>
        <Router>
          <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-dark)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MediaListPage mediaType="movie" title="Filmler" />} />
                <Route path="/tv" element={<MediaListPage mediaType="tv" title="Diziler" />} />
                <Route path="/movie/:id" element={<MediaDetailsPage />} />
                <Route path="/tv/:id" element={<MediaDetailsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/shortfilms" element={<ShortFilmsPage />} />
                <Route path="*" element={
                  <div className="container" style={{ padding: '64px 16px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>404 - Sayfa Bulunamadı</h1>
                    <p style={{ fontSize: '20px', color: 'var(--text-muted)' }}>Aradığınız sayfaya ulaşılamıyor.</p>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ShortFilmProvider>
    </WatchlistProvider>
  );
}

export default App;
