import axios from 'axios';
import { SearchResult, MediaDetails, Genre } from '../types';

// Kendi TMDB API anahtarınızı https://www.themoviedb.org/settings/api adresinden alabilirsiniz
const API_KEY = 'YOUR_TMDB_API_KEY_HERE'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API isteği için bir axios instance oluştur
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'tr-TR',
  },
});

// Axios interceptor ekle
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Yanıt Hatası:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API İstek Hatası:', error.request);
    } else {
      console.error('API Hatası:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=Görsel+Yok';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<SearchResult> => {
  try {
    const response = await api.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error('Trend API hatası:', error);
    throw error;
  }
};

export const getPopular = async (mediaType: 'movie' | 'tv'): Promise<SearchResult> => {
  try {
    const response = await api.get(`/${mediaType}/popular`);
    return response.data;
  } catch (error) {
    console.error('Popüler içerik API hatası:', error);
    throw error;
  }
};

export const searchMedia = async (query: string, page: number = 1): Promise<SearchResult> => {
  try {
    const response = await api.get('/search/multi', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Arama API hatası:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: number): Promise<MediaDetails> => {
  try {
    const response = await api.get(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,images',
        include_image_language: 'tr,null'
      },
    });
    
    // Görsel verileri kontrol ve düzenleme
    if (!response.data.images || !response.data.images.backdrops || response.data.images.backdrops.length === 0) {
      console.log(`Film ID ${id} için görsel verisi yok veya boş, varsayılan değerler kullanılıyor.`);
      // Eğer görsel verisi yoksa, boş bir dizi atayalım
      response.data.images = {
        backdrops: [],
        posters: response.data.poster_path ? [{
          file_path: response.data.poster_path,
          aspect_ratio: 1.78,
          height: 1080,
          width: 1920,
          vote_average: 0,
          vote_count: 0
        }] : []
      };
    }
    
    // Cast verisi kontrolü
    if (!response.data.credits || !response.data.credits.cast) {
      console.log(`Film ID ${id} için oyuncu verisi yok veya boş, varsayılan değerler kullanılıyor.`);
      response.data.credits = {
        cast: [],
        crew: []
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Film detayları API hatası:', error);
    throw error;
  }
};

export const getTVDetails = async (id: number): Promise<MediaDetails> => {
  try {
    const response = await api.get(`/tv/${id}`, {
      params: {
        append_to_response: 'videos,credits,images',
        include_image_language: 'tr,null'
      },
    });
    
    // Görsel verileri kontrol ve düzenleme
    if (!response.data.images || !response.data.images.backdrops || response.data.images.backdrops.length === 0) {
      console.log(`Dizi ID ${id} için görsel verisi yok veya boş, varsayılan değerler kullanılıyor.`);
      // Eğer görsel verisi yoksa, boş bir dizi atayalım
      response.data.images = {
        backdrops: [],
        posters: response.data.poster_path ? [{
          file_path: response.data.poster_path,
          aspect_ratio: 1.78,
          height: 1080,
          width: 1920,
          vote_average: 0,
          vote_count: 0
        }] : []
      };
    }
    
    // Cast verisi kontrolü
    if (!response.data.credits || !response.data.credits.cast) {
      console.log(`Dizi ID ${id} için oyuncu verisi yok veya boş, varsayılan değerler kullanılıyor.`);
      response.data.credits = {
        cast: [],
        crew: []
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Dizi detayları API hatası:', error);
    throw error;
  }
};

export const getGenres = async (mediaType: 'movie' | 'tv'): Promise<Genre[]> => {
  try {
    const response = await api.get(`/genre/${mediaType}/list`);
    return response.data.genres;
  } catch (error) {
    console.error('Kategori API hatası:', error);
    throw error;
  }
};

export const discoverMedia = async (
  mediaType: 'movie' | 'tv',
  { genre, year, sortBy }: { genre?: number; year?: number; sortBy?: string },
  page: number = 1
): Promise<SearchResult> => {
  try {
    const response = await api.get(`/discover/${mediaType}`, {
      params: {
        with_genres: genre,
        primary_release_year: mediaType === 'movie' ? year : undefined,
        first_air_date_year: mediaType === 'tv' ? year : undefined,
        sort_by: sortBy || 'popularity.desc',
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Keşfet API hatası:', error);
    throw error;
  }
}; 