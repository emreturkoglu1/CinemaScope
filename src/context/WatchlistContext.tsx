import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WatchlistItem } from '../types';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  watchedList: WatchlistItem[];
  likedList: WatchlistItem[];
  isInWatchlist: (id: number, type: string) => boolean;
  isInWatchedList: (id: number, type: string) => boolean;
  isInLikedList: (id: number, type: string) => boolean;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number, type: string) => void;
  addToWatchedList: (item: WatchlistItem) => void;
  removeFromWatchedList: (id: number, type: string) => void;
  addToLikedList: (item: WatchlistItem) => void;
  removeFromLikedList: (id: number, type: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  const [watchedList, setWatchedList] = useState<WatchlistItem[]>(() => {
    const savedWatchedList = localStorage.getItem('watchedList');
    return savedWatchedList ? JSON.parse(savedWatchedList) : [];
  });

  const [likedList, setLikedList] = useState<WatchlistItem[]>(() => {
    const savedLikedList = localStorage.getItem('likedList');
    return savedLikedList ? JSON.parse(savedLikedList) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('watchedList', JSON.stringify(watchedList));
  }, [watchedList]);

  useEffect(() => {
    localStorage.setItem('likedList', JSON.stringify(likedList));
  }, [likedList]);

  const isInWatchlist = (id: number, type: string) => {
    return watchlist.some(item => item.id === id && item.media_type === type);
  };

  const isInWatchedList = (id: number, type: string) => {
    return watchedList.some(item => item.id === id && item.media_type === type);
  };

  const isInLikedList = (id: number, type: string) => {
    return likedList.some(item => item.id === id && item.media_type === type);
  };

  const addToWatchlist = (item: WatchlistItem) => {
    if (!isInWatchlist(item.id, item.media_type)) {
      setWatchlist(prev => [...prev, item]);
    }
  };

  const removeFromWatchlist = (id: number, type: string) => {
    setWatchlist(prev => prev.filter(item => !(item.id === id && item.media_type === type)));
  };

  const addToWatchedList = (item: WatchlistItem) => {
    if (!isInWatchedList(item.id, item.media_type)) {
      setWatchedList(prev => [...prev, item]);
      // İzlenen listeye eklendiğinde izleme listesinden kaldırılabilir
      removeFromWatchlist(item.id, item.media_type);
    }
  };

  const removeFromWatchedList = (id: number, type: string) => {
    setWatchedList(prev => prev.filter(item => !(item.id === id && item.media_type === type)));
  };

  const addToLikedList = (item: WatchlistItem) => {
    if (!isInLikedList(item.id, item.media_type)) {
      setLikedList(prev => [...prev, item]);
    }
  };

  const removeFromLikedList = (id: number, type: string) => {
    setLikedList(prev => prev.filter(item => !(item.id === id && item.media_type === type)));
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      watchedList,
      likedList,
      isInWatchlist,
      isInWatchedList,
      isInLikedList,
      addToWatchlist,
      removeFromWatchlist,
      addToWatchedList,
      removeFromWatchedList,
      addToLikedList,
      removeFromLikedList
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}; 