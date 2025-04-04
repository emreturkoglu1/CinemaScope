import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/api';
import { StarIcon, EyeIcon } from '@heroicons/react/24/solid';
import { HeartIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Movie, TVShow } from '../types';

const WatchlistPage: React.FC = () => {
  const { 
    watchlist, 
    removeFromWatchlist, 
    addToWatchedList,
    addToLikedList,
    isInLikedList
  } = useWatchlist();
  
  const [sortBy, setSortBy] = useState<string>('date_added');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Watchlist verilerini Movie veya TVShow türüne dönüştürme
  const convertToMediaItems = (items: typeof watchlist): (Movie | TVShow)[] => {
    return items.map(item => ({
      id: item.id,
      title: item.title || '',
      name: item.name || '',
      poster_path: item.poster_path || '',
      backdrop_path: '',
      overview: '',
      release_date: '',
      first_air_date: '',
      vote_average: item.vote_average || 0,
      vote_count: 0,
      genre_ids: [],
      media_type: item.media_type
    }));
  };

  const handleMarkAsWatched = (id: number, type: string) => {
    const item = watchlist.find(item => item.id === id && item.media_type === type);
    if (item) {
      addToWatchedList(item);
    }
  };

  const handleLike = (id: number, type: string) => {
    const item = watchlist.find(item => item.id === id && item.media_type === type);
    if (item) {
      addToLikedList(item);
    }
  };

  if (watchlist.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="watchlist-header">
          <h1 className="watchlist-title">İzleme Listem</h1>
        </div>
        
        <div className="watchlist-empty">
          <div className="watchlist-empty-icon">
            <EyeIcon style={{ width: '100%', height: '100%', color: 'var(--text-muted)' }} />
          </div>
          <h2 className="watchlist-empty-title">İzleme listenizde henüz bir içerik bulunmuyor</h2>
          <p className="watchlist-empty-text">
            Film veya dizilere göz atarken yer işareti simgesine tıklayarak bunları daha sonra izlemek üzere kaydedebilirsiniz. Bu, Letterboxd gibi film günlüğü tutmak için harika bir yoldur.
          </p>
          <Link to="/" className="btn">İçeriklere Göz At</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="watchlist-header">
        <h1 className="watchlist-title">İzleme Listem</h1>
        <div className="watchlist-stats">
          {watchlist.length} film/dizi • İzlenecekler
        </div>
      </div>

      <div className="watchlist-actions" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <div className="watchlist-sort" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="sort-select" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Sırala:</label>
          <select 
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              backgroundColor: 'var(--background-light)',
              color: 'var(--text-light)',
              border: '1px solid var(--border-color)',
              borderRadius: '3px',
              padding: '5px 10px',
              fontSize: '14px'
            }}
          >
            <option value="date_added">Eklenme Tarihi</option>
            <option value="title">Başlık</option>
            <option value="rating">Puan</option>
            <option value="release_date">Yayın Tarihi</option>
          </select>
        </div>

        <div className="view-toggle" style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={() => setViewType('grid')} 
            style={{
              backgroundColor: viewType === 'grid' ? 'var(--background-light)' : 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '3px',
              padding: '5px 10px',
              color: viewType === 'grid' ? 'var(--primary-color)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H10V10H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 3H21V10H14V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 14H10V21H3V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 14H21V21H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button 
            onClick={() => setViewType('list')} 
            style={{
              backgroundColor: viewType === 'list' ? 'var(--background-light)' : 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '3px',
              padding: '5px 10px',
              color: viewType === 'list' ? 'var(--primary-color)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {viewType === 'grid' ? (
        <div className="poster-grid">
          {watchlist.map((item) => {
            const title = item.title || item.name || 'İsimsiz İçerik';
            const type = item.media_type;
            const isLiked = isInLikedList(item.id, type);
            
            return (
              <div key={`${item.id}-${type}`} className="poster-card">
                <div style={{ position: 'relative' }}>
                  <Link to={`/${type}/${item.id}`}>
                    <img 
                      src={getImageUrl(item.poster_path || null)} 
                      alt={title}
                      className="poster-img"
                    />
                  </Link>
                  <div className="poster-overlay">
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleMarkAsWatched(item.id, type)}
                        title="İzledim"
                        className="action-button"
                      >
                        <CheckIcon style={{ width: '16px', height: '16px', color: 'white' }} />
                      </button>
                      <button 
                        onClick={() => handleLike(item.id, type)}
                        title={isLiked ? "Beğendim" : "Beğen"}
                        className="action-button"
                      >
                        <HeartIcon style={{ 
                          width: '16px', 
                          height: '16px', 
                          color: isLiked ? 'var(--primary-color)' : 'white' 
                        }} />
                      </button>
                      <button 
                        onClick={() => removeFromWatchlist(item.id, type)}
                        title="İzleme Listemden Çıkar"
                        className="action-button"
                      >
                        <TrashIcon style={{ width: '16px', height: '16px', color: 'white' }} />
                      </button>
                    </div>
                  </div>
                  {item.vote_average !== undefined && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '8px', 
                      left: '8px', 
                      backgroundColor: 'rgba(0,0,0,0.6)', 
                      borderRadius: '3px',
                      padding: '3px 5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <StarIcon style={{ height: '12px', width: '12px', color: 'var(--rating-star)' }} />
                      <span style={{ color: 'white', fontSize: '12px' }}>{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <h3 className="poster-title">{title}</h3>
                <p className="poster-year">{type === 'movie' ? 'Film' : 'Dizi'}</p>
                <div className="poster-actions">
                  <Link 
                    to={`/${type}/${item.id}`} 
                    className="btn btn-sm"
                  >
                    Detaylar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="watchlist-list">
          {watchlist.map((item) => {
            const title = item.title || item.name || 'İsimsiz İçerik';
            const type = item.media_type;
            const isLiked = isInLikedList(item.id, type);
            
            return (
              <div key={`${item.id}-${type}`} className="watchlist-item">
                <div className="watchlist-poster">
                  <Link to={`/${type}/${item.id}`}>
                    <img 
                      src={getImageUrl(item.poster_path || null)} 
                      alt={title}
                    />
                  </Link>
                </div>
                <div className="watchlist-info">
                  <Link to={`/${type}/${item.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="watchlist-item-title">{title}</h3>
                  </Link>
                  <div className="watchlist-item-meta">
                    {type === 'movie' ? 'Film' : 'Dizi'}
                    {item.vote_average !== undefined && (
                      <span style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center' }}>
                        <StarIcon style={{ height: '12px', width: '12px', color: 'var(--rating-star)', marginRight: '3px' }} />
                        {item.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="watchlist-item-actions">
                    <div className="action-btns" style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-sm"
                        style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => handleMarkAsWatched(item.id, type)}
                        title="İzledim olarak işaretle"
                      >
                        <CheckIcon style={{ height: '12px', width: '12px' }} />
                        İzledim
                      </button>
                      <button 
                        className="btn btn-sm btn-outline"
                        style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => handleLike(item.id, type)}
                        title="Beğen"
                      >
                        <HeartIcon style={{ 
                          height: '12px', 
                          width: '12px',
                          color: isLiked ? 'var(--primary-color)' : 'currentColor'
                        }} />
                        Beğen
                      </button>
                      <Link 
                        to={`/${type}/${item.id}`} 
                        className="btn btn-sm btn-outline"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Detaylar
                      </Link>
                    </div>
                    <button 
                      onClick={() => removeFromWatchlist(item.id, type)}
                      className="remove-btn"
                      title="İzleme Listemden Çıkar"
                    >
                      <TrashIcon style={{ height: '16px', width: '16px' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage; 