import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrending, getPopular } from '../services/api';
import { Movie, TVShow } from '../types';
import MediaGrid from '../components/MediaGrid';
import { FilmIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trendingData, moviesData, tvData] = await Promise.all([
          getTrending(),
          getPopular('movie'),
          getPopular('tv')
        ]);
        
        setTrending(trendingData.results.slice(0, 10));
        setPopularMovies(moviesData.results.slice(0, 10) as Movie[]);
        setPopularTV(tvData.results.slice(0, 10) as TVShow[]);
        setError(null);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Ana sayfa veri yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <strong>Hata!</strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Film ve Dizileri Keşfedin</h1>
            <p className="hero-subtitle">
              İzlediğiniz filmler ve dizileri takip edin, arkadaşlarınızla paylaşın.
            </p>
            <div className="hero-actions">
              <Link to="/movies" className="btn">Filmlere Göz At</Link>
              <Link to="/tv" className="btn btn-outline">Dizileri Keşfet</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0' }}>
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Kısa Filmler</h2>
            <Link to="/shortfilms" className="view-all-link">
              Tümünü Gör
            </Link>
          </div>
          
          <div className="shortfilm-banner">
            <div className="shortfilm-banner-content">
              <h2 className="shortfilm-banner-title">Kısa Film Tutkunları İçin</h2>
              <p className="shortfilm-banner-text">
                Bağımsız film yapımcılarının eserlerini keşfedin veya kendi kısa filminizi paylaşın.
                Filmlerinizi topluluğumuzla buluşturun ve sinemaya olan tutkunuzu gösterin.
              </p>
              <Link to="/shortfilms" className="btn">
                <FilmIcon className="btn-icon" />
                Kısa Filmlere Git
              </Link>
            </div>
            <div className="shortfilm-banner-image">
              <img src="https://img.freepik.com/premium-vector/cinematography-concept-film-industry-movie-making-process-idea-movie-clapper-camera-creative-process-vector-illustration-cartoon-style_277904-8187.jpg" alt="Kısa Filmler" />
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Trend İçerikler</h2>
          </div>
          <MediaGrid 
            items={trending} 
            title=""
          />
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Popüler Filmler</h2>
            <Link to="/movies" className="view-all-link">
              Tümünü Gör
            </Link>
          </div>
          <MediaGrid 
            items={popularMovies} 
            type="movie"
            title=""
          />
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Popüler Diziler</h2>
            <Link to="/tv" className="view-all-link">
              Tümünü Gör
            </Link>
          </div>
          <MediaGrid 
            items={popularTV} 
            type="tv"
            title=""
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 