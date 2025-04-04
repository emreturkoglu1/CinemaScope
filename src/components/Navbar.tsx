import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserIcon, MagnifyingGlassIcon, FilmIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { UserIcon as UserIconSolid, FilmIcon as FilmIconSolid, VideoCameraIcon as VideoCameraIconSolid } from '@heroicons/react/24/solid';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  // Aktif sayfayı kontrol et
  const isActive = (path: string) => {
    if (path === '/profile') {
      return location.pathname === path;
    } else if (path === '/shortfilms') {
      return location.pathname === path;
    } else if (path === '/watchlist') {
      return location.pathname === path;
    }
    return false;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          CinemaScope
        </Link>
        
        <div className="nav-content">
          <div className="search-toggle-container">
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className="search-toggle-btn"
              aria-label={showSearch ? "Aramayı Kapat" : "Arama"}
            >
              <MagnifyingGlassIcon className="search-toggle-icon" />
            </button>
          </div>
          
          <div className={`search-form-container ${showSearch ? 'show' : ''}`}>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-container">
                <MagnifyingGlassIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Film, dizi veya kişi ara..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="button" 
                className="search-close-btn" 
                onClick={() => setShowSearch(false)}
                aria-label="Aramayı Kapat"
              >
                ×
              </button>
            </form>
          </div>
          
          <div className="nav-links">
            <Link to="/watchlist" className={`nav-link ${isActive('/watchlist') ? 'active' : ''}`} title="İzleme Listesi">
              {isActive('/watchlist') ? 
                <FilmIconSolid className="nav-icon" /> : 
                <FilmIcon className="nav-icon" />
              }
              <span className="nav-label">İzleme Listesi</span>
            </Link>
            
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} title="Profil">
              {isActive('/profile') ? 
                <UserIconSolid className="nav-icon" /> : 
                <UserIcon className="nav-icon" />
              }
              <span className="nav-label">Profil</span>
            </Link>
            
            <Link 
              to="/shortfilms" 
              className={`nav-link special-link ${isActive('/shortfilms') ? 'active' : ''}`}
              title="Kısa Filmler"
            >
              {isActive('/shortfilms') ? 
                <VideoCameraIconSolid className="nav-icon" /> : 
                <VideoCameraIcon className="nav-icon" />
              }
              <span className="nav-label">Kısa Filmler</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 