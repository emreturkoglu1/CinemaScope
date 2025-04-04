import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/api';
import { StarIcon } from '@heroicons/react/24/solid';
import { FilmIcon, BookmarkIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import MediaGrid from '../components/MediaGrid';
import { Movie, TVShow } from '../types';

const ProfilePage: React.FC = () => {
  const { watchlist, watchedList, likedList } = useWatchlist();
  const [activeTab, setActiveTab] = useState<'izlenen' | 'izlenecek' | 'begenilen'>('izlenen');
  
  // Verileri dönüştürme fonksiyonu
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
  
  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'izlenen':
        if (watchedList.length === 0) {
          return (
            <div className="empty-state">
              <FilmIcon className="empty-icon" />
              <h3>Henüz izlediğiniz bir film yok</h3>
              <p>İzlediğiniz filmleri "İzledim" butonuna tıklayarak buraya ekleyin.</p>
              <Link to="/movies" className="btn">Filmlere Göz At</Link>
            </div>
          );
        }
        return <MediaGrid items={convertToMediaItems(watchedList)} title="" />;
        
      case 'izlenecek':
        if (watchlist.length === 0) {
          return (
            <div className="empty-state">
              <BookmarkIcon className="empty-icon" />
              <h3>İzleme listenizde film yok</h3>
              <p>Daha sonra izlemek istediğiniz filmleri "İzleme Listeme Ekle" butonuna tıklayarak buraya ekleyin.</p>
              <Link to="/movies" className="btn">Filmlere Göz At</Link>
            </div>
          );
        }
        return <MediaGrid items={convertToMediaItems(watchlist)} title="" />;
        
      case 'begenilen':
        if (likedList.length === 0) {
          return (
            <div className="empty-state">
              <HeartIcon className="empty-icon" />
              <h3>Henüz beğendiğiniz bir film yok</h3>
              <p>Beğendiğiniz filmleri "Beğen" butonuna tıklayarak buraya ekleyin.</p>
              <Link to="/movies" className="btn">Filmlere Göz At</Link>
            </div>
          );
        }
        return <MediaGrid items={convertToMediaItems(likedList)} title="" />;
    }
  };
  
  const userStats = {
    films: watchedList.length,
    likes: likedList.length,
    watchlist: watchlist.length
  };
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="profile-inner">
            <div className="avatar-container">
              <UserIcon className="avatar-placeholder" />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">Kullanıcı</h1>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{userStats.films}</span>
                  <span className="stat-label">İzlenen</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userStats.likes}</span>
                  <span className="stat-label">Beğenilen</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{userStats.watchlist}</span>
                  <span className="stat-label">İzleme Listesi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="container">
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'izlenen' ? 'active' : ''}`} 
              onClick={() => setActiveTab('izlenen')}
            >
              İZLEDİKLERİM
            </button>
            <button 
              className={`tab-button ${activeTab === 'izlenecek' ? 'active' : ''}`} 
              onClick={() => setActiveTab('izlenecek')}
            >
              İZLEME LİSTEM
            </button>
            <button 
              className={`tab-button ${activeTab === 'begenilen' ? 'active' : ''}`} 
              onClick={() => setActiveTab('begenilen')}
            >
              BEĞENDİKLERİM
            </button>
          </div>
          
          <div className="tab-content">
            {getActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 