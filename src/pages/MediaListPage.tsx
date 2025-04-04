import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { discoverMedia } from '../services/api';
import { Movie, TVShow, FilterOptions } from '../types';
import MediaGrid from '../components/MediaGrid';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';

interface MediaListPageProps {
  mediaType: 'movie' | 'tv';
  title: string;
}

const MediaListPage: React.FC<MediaListPageProps> = ({ mediaType, title }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [media, setMedia] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [filters, setFilters] = useState<FilterOptions>({
    genre: searchParams.get('genre') ? Number(searchParams.get('genre')) : undefined,
    year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    sortBy: searchParams.get('sort_by') || 'popularity.desc',
  });

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const data = await discoverMedia(mediaType, filters, currentPage);
        setMedia(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB API en fazla 500 sayfa döndürür
        setError(null);
      } catch (err) {
        setError('İçerik yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error(`${mediaType} listesi yükleme hatası:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
    
    // URL parametrelerini güncelle
    const params: Record<string, string> = { page: currentPage.toString() };
    if (filters.genre) params.genre = filters.genre.toString();
    if (filters.year) params.year = filters.year.toString();
    if (filters.sortBy) params.sort_by = filters.sortBy;
    setSearchParams(params);
    
  }, [mediaType, filters, currentPage, setSearchParams]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getHeaderBackground = () => {
    return mediaType === 'movie' 
      ? 'url(https://image.tmdb.org/t/p/original/xBFYRCFCaVldHz7VuQbJkFKAqSM.jpg)'
      : 'url(https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg)';
  };

  return (
    <div className="media-list-page">
      <div className="page-header" style={{ backgroundImage: getHeaderBackground() }}>
        <div className="container">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">
            {mediaType === 'movie' 
              ? 'En popüler filmler, en yeni çıkanlar ve sizin için seçilmiş olanlar'
              : 'En popüler diziler, en yeni sezonlar ve keşfedilmeyi bekleyen içerikler'
            }
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '30px 0' }}>
        <div className="filter-section">
          <FilterBar mediaType={mediaType} onFilterChange={handleFilterChange} />
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="error-message">
            <strong>Hata!</strong>
            <span>{error}</span>
          </div>
        ) : media.length === 0 ? (
          <div className="empty-state">
            <h3>Bu filtrelerle eşleşen sonuç bulunamadı</h3>
            <p>Lütfen farklı filtre seçenekleri deneyin</p>
          </div>
        ) : (
          <>
            <MediaGrid 
              items={media} 
              type={mediaType} 
              title={`${filters.genre || filters.year ? 'Filtrelenmiş ' : ''}${title}`}
            />
            
            <div className="pagination-container">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaListPage; 