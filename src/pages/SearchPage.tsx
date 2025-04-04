import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMedia } from '../services/api';
import { Movie, TVShow } from '../types';
import MediaGrid from '../components/MediaGrid';
import Pagination from '../components/Pagination';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(pageParam ? parseInt(pageParam) : 1);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchMedia(query, currentPage);
        // Sadece film ve dizi sonuçlarını filtrele (kişiler vs. hariç)
        const filteredResults = data.results.filter(
          (item): item is Movie | TVShow => 
            item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filteredResults);
        setTotalPages(Math.min(data.total_pages, 500));
        setError(null);
      } catch (err) {
        setError('Arama sonuçları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Arama sonuçları yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // URL'i güncelle, arama sorgusunu koru
    const newUrl = `?q=${encodeURIComponent(query)}&page=${page}`;
    window.history.pushState({}, '', newUrl);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {query ? (
        <h1 className="text-3xl font-bold text-white mb-6">
          "{query}" için Arama Sonuçları
        </h1>
      ) : (
        <h1 className="text-3xl font-bold text-white mb-6">Arama</h1>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : !query ? (
        <div className="text-center text-slate-400 py-12">
          <p className="text-xl">Aramak istediğiniz filmi veya diziyi girin.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <p className="text-xl">"{query}" için sonuç bulunamadı.</p>
          <p className="mt-2">Lütfen farklı anahtar kelimeler deneyin.</p>
        </div>
      ) : (
        <>
          <p className="text-slate-300 mb-4">Toplam {results.length} sonuç bulundu.</p>
          <MediaGrid items={results} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage; 