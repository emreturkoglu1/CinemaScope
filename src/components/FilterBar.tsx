import React, { useState, useEffect } from 'react';
import { FilterOptions, Genre } from '../types';
import { getGenres } from '../services/api';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface FilterBarProps {
  mediaType: 'movie' | 'tv';
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ mediaType, onFilterChange }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedSortBy, setSelectedSortBy] = useState<string>('popularity.desc');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresList = await getGenres(mediaType);
        setGenres(genresList);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    };

    fetchGenres();
  }, [mediaType]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSelectedGenre(value);
    onFilterChange({ genre: value, year: selectedYear, sortBy: selectedSortBy });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSelectedYear(value);
    onFilterChange({ genre: selectedGenre, year: value, sortBy: selectedSortBy });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSortBy(e.target.value);
    onFilterChange({ genre: selectedGenre, year: selectedYear, sortBy: e.target.value });
  };

  const toggleFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  // Yıl seçenekleri için bir dizi oluştur (şimdiki yıldan 1990'a kadar)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  return (
    <div className="filter-bar">
      <div className="filter-header" onClick={toggleFilters}>
        <AdjustmentsHorizontalIcon className="filter-icon" />
        <span>Filtreler</span>
      </div>
      
      <div className={`filter-content ${isFiltersExpanded ? 'expanded' : ''}`}>
        <div className="filter-group">
          <label htmlFor="genre">Kategori</label>
          <select
            id="genre"
            value={selectedGenre || ''}
            onChange={handleGenreChange}
            className="filter-select"
          >
            <option value="">Tüm Kategoriler</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year">Yıl</label>
          <select
            id="year"
            value={selectedYear || ''}
            onChange={handleYearChange}
            className="filter-select"
          >
            <option value="">Tüm Yıllar</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sırala</label>
          <select
            id="sortBy"
            value={selectedSortBy}
            onChange={handleSortByChange}
            className="filter-select"
          >
            <option value="popularity.desc">Popülerlik (Azalan)</option>
            <option value="popularity.asc">Popülerlik (Artan)</option>
            <option value="vote_average.desc">Puan (Azalan)</option>
            <option value="vote_average.asc">Puan (Artan)</option>
            <option value="release_date.desc">Yayın Tarihi (Yeni-Eski)</option>
            <option value="release_date.asc">Yayın Tarihi (Eski-Yeni)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 