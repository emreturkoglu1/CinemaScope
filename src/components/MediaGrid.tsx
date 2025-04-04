import React from 'react';
import { Movie, TVShow } from '../types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: (Movie | TVShow)[];
  type?: 'movie' | 'tv';
  title?: string;
  viewAllLink?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({ 
  items, 
  type = 'movie', 
  title, 
  viewAllLink 
}) => {
  const determineType = (item: Movie | TVShow): 'movie' | 'tv' => {
    if (item.media_type) {
      return item.media_type as 'movie' | 'tv';
    }
    
    // Objeye göre tipi belirleme
    if ('title' in item) {
      return 'movie';
    } else {
      return 'tv';
    }
  };

  return (
    <div className="section">
      {title && (
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className="view-all-link">
              Tümünü Gör
            </a>
          )}
        </div>
      )}
      
      <div className="media-grid">
        {items.map((item) => (
          <MediaCard 
            key={item.id} 
            media={item} 
            type={determineType(item) || type}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaGrid; 