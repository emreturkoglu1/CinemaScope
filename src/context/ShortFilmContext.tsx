import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Kısa film veri yapısı
export interface ShortFilm {
  id: string;          // YouTube video ID'si
  title: string;       // Film başlığı
  creator: string;     // Film yapımcısı/yaratıcısı
  description: string; // Film açıklaması
  thumbnail: string;   // Film küçük resmi (thumbnail) URL'si
  videoUrl: string;    // YouTube video URL'si
  category: string;    // Kategori alanı eklendi
  addedAt: number;     // Eklenme tarihi (timestamp)
}

// Bazı örnek kısa filmler
const SAMPLE_FILMS: ShortFilm[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Yolda",
    creator: "Ahmet Yılmaz",
    description: "Kayboluşun ve kendini bulmanın hikayesi",
    thumbnail: "https://westburyarts.org/wp-content/uploads/2016/12/film.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Drama",
    addedAt: Date.now() - 1000000
  },
  {
    id: "O7j4_aP8dWA",
    title: "Öteki Dünya",
    creator: "Canan Öztürk",
    description: "Uzay ve zaman kavramlarını sorgulayan bir kısa film",
    thumbnail: "https://img.youtube.com/vi/O7j4_aP8dWA/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/O7j4_aP8dWA",
    category: "Bilim Kurgu",
    addedAt: Date.now() - 2000000
  },
  {
    id: "6qpudAhYhpc",
    title: "Son Nefes",
    creator: "Zeynep Kaya",
    description: "Hayatın son anlarında geriye dönüp bakmanın hikayesi",
    thumbnail: "https://img.youtube.com/vi/6qpudAhYhpc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/6qpudAhYhpc",
    category: "Drama",
    addedAt: Date.now() - 3000000
  },
  {
    id: "rC95MEenIxA",
    title: "Günbatımı",
    creator: "Deniz Altan",
    description: "Hayatının son günlerini yaşayan bir adamın hikayesi",
    thumbnail: "https://img.youtube.com/vi/rC95MEenIxA/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/rC95MEenIxA",
    category: "Drama",
    addedAt: Date.now() - 4000000
  }
];

// Context için tip tanımı
interface ShortFilmContextType {
  shortFilms: ShortFilm[];
  addShortFilm: (film: ShortFilm) => void;
  removeShortFilm: (id: string) => void;
  isInShortFilms: (id: string) => boolean;
}

// Context oluşturma
const ShortFilmContext = createContext<ShortFilmContextType | undefined>(undefined);

// Provider props tipi
interface ShortFilmProviderProps {
  children: ReactNode;
}

// Provider bileşeni
export const ShortFilmProvider: React.FC<ShortFilmProviderProps> = ({ children }) => {
  // Kısa filmler için state
  const [shortFilms, setShortFilms] = useState<ShortFilm[]>(() => {
    // Tarayıcı depolamasından (localStorage) mevcut filmleri yükleme
    const savedFilms = localStorage.getItem('shortFilms');
    return savedFilms ? JSON.parse(savedFilms) : SAMPLE_FILMS;
  });

  // Filmler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('shortFilms', JSON.stringify(shortFilms));
  }, [shortFilms]);

  // Filme ekleme
  const addShortFilm = (film: ShortFilm) => {
    if (!isInShortFilms(film.id)) {
      setShortFilms(prevFilms => [...prevFilms, film]);
    }
  };

  // Filmi kaldırma
  const removeShortFilm = (id: string) => {
    setShortFilms(prevFilms => prevFilms.filter(film => film.id !== id));
  };

  // Filmin listede olup olmadığını kontrol etme
  const isInShortFilms = (id: string) => {
    return shortFilms.some(film => film.id === id);
  };

  // Context değerleri
  const contextValue: ShortFilmContextType = {
    shortFilms,
    addShortFilm,
    removeShortFilm,
    isInShortFilms
  };

  // Provider
  return (
    <ShortFilmContext.Provider value={contextValue}>
      {children}
    </ShortFilmContext.Provider>
  );
};

// Kullanım için hook
export const useShortFilms = () => {
  const context = useContext(ShortFilmContext);
  if (context === undefined) {
    throw new Error('useShortFilms must be used within a ShortFilmProvider');
  }
  return context;
}; 