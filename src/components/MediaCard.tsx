import React from 'react';
import { Link } from 'react-router-dom';
import { Movie, TVShow } from '../types';
import { StarIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../services/api';

interface MediaCardProps {
  media: Movie | TVShow;
  type: 'movie' | 'tv';
}

const MediaCard: React.FC<MediaCardProps> = ({ media, type }) => {
  const { 
    isInWatchlist, 
    isInWatchedList, 
    isInLikedList, 
    addToWatchlist, 
    removeFromWatchlist,
    addToWatchedList,
    removeFromWatchedList,
    addToLikedList,
    removeFromLikedList
  } = useWatchlist();
  
  const isMovie = 'title' in media;
  const title = isMovie ? media.title : media.name;
  const releaseDate = isMovie ? media.release_date : media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  const inWatchlist = isInWatchlist(media.id, type);
  const inWatchedList = isInWatchedList(media.id, type);
  const inLikedList = isInLikedList(media.id, type);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(media.id, type);
    } else {
      addToWatchlist({
        id: media.id,
        media_type: type,
        title: isMovie ? media.title : undefined,
        name: isMovie ? undefined : (media as TVShow).name,
        poster_path: media.poster_path,
        vote_average: media.vote_average
      });
    }
  };

  const handleWatchedToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchedList) {
      removeFromWatchedList(media.id, type);
    } else {
      addToWatchedList({
        id: media.id,
        media_type: type,
        title: isMovie ? media.title : undefined,
        name: isMovie ? undefined : (media as TVShow).name,
        poster_path: media.poster_path,
        vote_average: media.vote_average
      });
    }
  };

  const handleLikedToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inLikedList) {
      removeFromLikedList(media.id, type);
    } else {
      addToLikedList({
        id: media.id,
        media_type: type,
        title: isMovie ? media.title : undefined,
        name: isMovie ? undefined : (media as TVShow).name,
        poster_path: media.poster_path,
        vote_average: media.vote_average
      });
    }
  };

  return (
    <div className="media-card">
      <div className="poster-wrapper">
        <Link to={`/${type}/${media.id}`} className="poster-link">
          <img 
            src={getImageUrl(media.poster_path)} 
            alt={title}
            className="poster"
          />
        </Link>
        
        <div className="poster-overlay">
          <div className="action-buttons">
            <button 
              className="action-button" 
              onClick={handleWatchlistToggle}
              title={inWatchlist ? "İzleme Listemden Çıkar" : "İzleme Listeme Ekle"}
            >
              <BookmarkIcon 
                className={`icon ${inWatchlist ? 'active' : ''}`} 
              />
            </button>
            
            <button 
              className="action-button" 
              onClick={handleLikedToggle}
              title={inLikedList ? "Beğenmekten Vazgeç" : "Beğen"}
            >
              <HeartIcon 
                className={`icon ${inLikedList ? 'active' : ''}`} 
              />
            </button>
            
            <button 
              className="action-button" 
              onClick={handleWatchedToggle}
              title={inWatchedList ? "İzlediklerimden Çıkar" : "İzledim"}
            >
              <EyeIcon 
                className={`icon ${inWatchedList ? 'active' : ''}`} 
              />
            </button>
          </div>
          
          {media.vote_average > 0 && (
            <div className="rating">
              <StarIcon className="star-icon" />
              <span>{media.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="media-info">
        <Link to={`/${type}/${media.id}`} className="title-link">
          <h3 className="media-title" title={title}>{title}</h3>
        </Link>
        <p className="media-year">{year}</p>
      </div>
    </div>
  );
};

export default MediaCard; 