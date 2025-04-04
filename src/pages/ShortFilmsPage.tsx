import React, { useState, useEffect } from 'react';
import { useShortFilms } from '../context/ShortFilmContext';
import { PlusIcon, FilmIcon, HeartIcon, ClockIcon, ShareIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// Film kategorileri
const FILM_CATEGORIES = [
  { id: "all", name: "Tüm Filmler" },
  { id: "drama", name: "Dram" },
  { id: "comedy", name: "Komedi" },
  { id: "horror", name: "Korku" },
  { id: "animation", name: "Animasyon" },
  { id: "documentary", name: "Belgesel" },
  { id: "experimental", name: "Deneysel" },
];

// Kısa film detay bileşeni için ShortFilm tipini kullan
interface ShortFilm {
  id: string;
  title: string;
  creator: string;
  description: string;
  category?: string;
  videoUrl: string;
  thumbnail: string;
  addedAt: number;
}

const ShortFilmsPage: React.FC = () => {
  const { shortFilms, addShortFilm } = useShortFilms();
  const [showAddForm, setShowAddForm] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [likedFilms, setLikedFilms] = useState<string[]>(() => {
    const savedLikedFilms = localStorage.getItem('likedShortFilms');
    return savedLikedFilms ? JSON.parse(savedLikedFilms) : [];
  });
  const [featuredFilm, setFeaturedFilm] = useState<any>(null);

  // Beğenileri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('likedShortFilms', JSON.stringify(likedFilms));
  }, [likedFilms]);

  // YouTube URL'sinden ID çıkarma
  const extractYoutubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Sayfa yüklendiğinde rastgele bir filmi öne çıkan olarak seçme
  useEffect(() => {
    if (shortFilms.length > 0) {
      const randomIndex = Math.floor(Math.random() * shortFilms.length);
      setFeaturedFilm(shortFilms[randomIndex]);
    }
  }, [shortFilms]);

  // Filmleri tarihe göre filtrele
  const filteredFilms = category === "all" 
    ? shortFilms 
    : shortFilms.filter(film => film.category === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // YouTube URL'sini doğrulama
    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      setError('Geçerli bir YouTube URL\'si giriniz');
      return;
    }

    // Form kontrolü
    if (!title.trim()) {
      setError('Film başlığı giriniz');
      return;
    }

    if (!creator.trim()) {
      setError('Film yapımcısını giriniz');
      return;
    }

    // Kısa filmi ekleme
    const categoryValue = (document.getElementById("film-category") as HTMLSelectElement)?.value || "drama";
    
    const newShortFilm = {
      id: videoId,
      title: title.trim(),
      creator: creator.trim(),
      description: description.trim(),
      videoUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      category: categoryValue,
      addedAt: Date.now()
    };

    // Thumbnail'ı önceden kontrol edelim, yüklenemezse alternatif kullanacağız
    const checkThumbnail = new Image();
    checkThumbnail.onerror = () => {
      // maxresdefault çalışmıyorsa hqdefault kullan
      const altThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      
      // Düzeltilmiş thumbnail ile film ekle
      const updatedFilm = {
        ...newShortFilm,
        thumbnail: altThumbnail
      };
      
      addShortFilm(updatedFilm);
      
      // Formu sıfırlama
      setYoutubeUrl('');
      setTitle('');
      setCreator('');
      setDescription('');
      setError('');
      setShowAddForm(false);
    };
    
    checkThumbnail.onload = () => {
      // Thumbnail doğru yüklendiyse, filmi ekle
      addShortFilm(newShortFilm);
      
      // Formu sıfırlama
      setYoutubeUrl('');
      setTitle('');
      setCreator('');
      setDescription('');
      setError('');
      setShowAddForm(false);
    };
    
    // Thumbnail'i kontrol et
    checkThumbnail.src = newShortFilm.thumbnail;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleLikeToggle = (filmId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedFilms.includes(filmId)) {
      setLikedFilms(prev => prev.filter(id => id !== filmId));
    } else {
      setLikedFilms(prev => [...prev, filmId]);
    }
  };

  // Film detayını gösteren bileşen
  const FilmDetail = ({ film, onClose }: { film: ShortFilm, onClose: () => void }) => {
    return (
      <div className="film-detail">
        <div className="video-player">
          <iframe 
            src={`https://www.youtube.com/embed/${extractYoutubeId(film.videoUrl)}?autoplay=1&rel=0`}
            title={film.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="film-detail-info">
          <span className="category-tag">{film.category || 'Genel'}</span>
          <h2 className="detail-title">{film.title}</h2>
          <p className="detail-creator">Yönetmen: {film.creator}</p>
          <p className="detail-date">Yüklenme: {formatDate(film.addedAt)}</p>
          <p className="detail-description">{film.description}</p>
          <div className="detail-actions">
            <button 
              className={`like-btn ${likedFilms.includes(film.id) ? 'active' : ''}`}
              onClick={(e) => handleLikeToggle(film.id, e)}
            >
              {likedFilms.includes(film.id) ? <HeartIconSolid className="btn-icon" /> : <HeartIcon className="btn-icon" />}
              {likedFilms.includes(film.id) ? 'Beğenildi' : 'Beğen'}
            </button>
            <button className="like-btn">
              <ShareIcon className="btn-icon" />
              Paylaş
            </button>
            <button className="watch-btn" onClick={onClose}>
              <ChevronLeftIcon className="btn-icon" />
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Örnek kısa film koleksiyonu
  const SAMPLE_FILMS = [
    {
      id: "1",
      title: "Yağmurda Yürüyüş",
      creator: "Ahmet Yılmaz",
      category: "short",
      description: "Modern şehir hayatının yalnızlığını anlatan etkileyici bir kısa film. Yağmurlu bir İstanbul gününde farklı insanların kesişen hayatlarına odaklanıyor.",
      thumbnail: "https://images.unsplash.com/photo-1468657988500-aca2be09f4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 2, 15),
      duration: "12:45",
      views: 1253,
      likes: 148,
      featured: true
    },
    {
      id: "2",
      title: "Mahallenin Sesleri",
      creator: "Zeynep Kaya",
      category: "medium",
      description: "Geleneksel bir Anadolu mahallesinde geçen, komşuluk ilişkilerini ve unutulmaya yüz tutmuş değerleri hatırlatan nostaljik bir anlatı.",
      thumbnail: "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 1, 28),
      duration: "18:32",
      views: 876,
      likes: 95
    },
    {
      id: "3",
      title: "Gökyüzünün Altında",
      creator: "Can Demir",
      category: "long",
      description: "Doğu Karadeniz'in eşsiz doğasında geçen, insanın doğayla olan ilişkisini ve yaşam mücadelesini konu alan belgesel tarzında bir kısa film.",
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 0, 10),
      duration: "28:15",
      views: 2430,
      likes: 312
    },
    {
      id: "4",
      title: "Mutfakta Bir Gün",
      creator: "Elif Yıldız",
      category: "short",
      description: "Geleneksel Türk mutfağının inceliklerini anlatan, bir aile restoranının mutfağında geçen bir günü konu alan keyifli bir kısa film.",
      thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 2, 5),
      duration: "09:45",
      views: 754,
      likes: 86
    },
    {
      id: "5",
      title: "Metalin Sesi",
      creator: "Burak Özdemir",
      category: "medium",
      description: "Geleneksel bakırcılık sanatını ve bu zanaatın son temsilcilerinden birinin hikayesini anlatan etkileyici bir belgesel.",
      thumbnail: "https://images.unsplash.com/photo-1531201890833-8c95b7cce908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 1, 20),
      duration: "22:10",
      views: 1128,
      likes: 167
    },
    {
      id: "6",
      title: "Sokakların Çocukları",
      creator: "Mert Aydın",
      category: "short",
      description: "İstanbul'un arka sokaklarında yaşayan sokak çocuklarının hayata tutunma mücadelesini anlatan dokunaklı bir kısa film.",
      thumbnail: "https://images.unsplash.com/photo-1445966275305-9806327ea2b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 2, 25),
      duration: "14:30",
      views: 965,
      likes: 112
    },
    {
      id: "7",
      title: "Zamanın İzleri",
      creator: "Deniz Yılmaz",
      category: "long",
      description: "Antik kentlerin gizemli dünyasına yolculuk yapan, Anadolu'nun zengin tarihini ve kültürel mirasını keşfeden bir belgesel.",
      thumbnail: "https://images.unsplash.com/photo-1490718720478-364a07a997cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 0, 5),
      duration: "32:18",
      views: 1876,
      likes: 254
    },
    {
      id: "8",
      title: "Bisikletin Peşinde",
      creator: "Cem Yıldırım",
      category: "medium",
      description: "Bisiklet tutkunu bir gencin Türkiye'yi bir uçtan bir uca bisikletle geçme macerasını konu alan, ilham verici bir hikaye.",
      thumbnail: "https://images.unsplash.com/photo-1501147830916-ce44a6359892?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      uploadDate: new Date(2024, 1, 10),
      duration: "20:45",
      views: 1543,
      likes: 198
    }
  ];

  return (
    <div className="short-films-page">
      {/* Hero Banner */}
      <div className="short-film-hero">
        <h1 className="sotw-title">Bağımsız Kısa Filmler</h1>
        <p className="sotw-subtitle">
          Bağımsız film yapımcılarının eserlerini keşfedin ve kendi kısa filminizi dünyayla paylaşın
        </p>
        <div className="sotw-actions">
          <button 
            className="sotw-btn sotw-btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <PlusIcon className="btn-icon" />
            Kısa Film Ekle
          </button>
          <button 
            className="sotw-btn sotw-btn-secondary"
            onClick={() => document.getElementById('films-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <FilmIcon className="btn-icon" />
            Filmleri Keşfet
          </button>
        </div>
      </div>

      {/* Öne Çıkan Film - Dikey düzen */}
      {featuredFilm && (
        <div className="container">
          <div className="featured-film">
            <div className="featured-thumbnail-wrapper">
              <img 
                src={featuredFilm.thumbnail} 
                alt={featuredFilm.title} 
                className="featured-thumbnail" 
              />
              <div 
                className="featured-overlay"
                onClick={() => setSelectedFilm(featuredFilm.id)}
              >
                {/* Beyaz oynat butonu kaldırıldı */}
              </div>
            </div>
            <div className="featured-info">
              <span className="featured-category">{featuredFilm.category || 'Genel'}</span>
              <h2 className="featured-title">{featuredFilm.title}</h2>
              <p className="featured-director">Yönetmen: {featuredFilm.creator}</p>
              <p className="featured-description">{featuredFilm.description}</p>
              <div className="featured-actions">
                <button 
                  className="watch-btn"
                  onClick={() => setSelectedFilm(featuredFilm.id)}
                >
                  <FilmIcon className="btn-icon" />
                  Şimdi İzle
                </button>
                <button 
                  className={`like-btn ${likedFilms.includes(featuredFilm.id) ? 'active' : ''}`}
                  onClick={(e) => handleLikeToggle(featuredFilm.id, e)}
                >
                  {likedFilms.includes(featuredFilm.id) ? (
                    <HeartIconSolid className="btn-icon" />
                  ) : (
                    <HeartIcon className="btn-icon" />
                  )}
                  {likedFilms.includes(featuredFilm.id) ? 'Beğenildi' : 'Beğen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Ana İçerik */}
      <div className="container" id="films-section">
        {/* Film Yükleme Formu */}
        {showAddForm && (
          <div className="add-film-modal">
            <div className="modal-overlay" onClick={() => setShowAddForm(false)}></div>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Kısa Film Ekle</h2>
                <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="add-film-form">
                {error && <div className="form-error">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="youtube-url">YouTube URL'si</label>
                  <input
                    type="text"
                    id="youtube-url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="film-title">Film Başlığı</label>
                  <input
                    type="text"
                    id="film-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Film başlığını girin"
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="film-creator">Yapımcı / Yönetmen</label>
                  <input
                    type="text"
                    id="film-creator"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Film yapımcısını girin"
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="film-category">Kategori</label>
                  <select
                    id="film-category"
                    className="form-control"
                  >
                    {FILM_CATEGORIES.filter(cat => cat.id !== "all").map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="film-description">Film Açıklaması</label>
                  <textarea
                    id="film-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Film hakkında kısa bir açıklama yazın"
                    className="form-control"
                    rows={3}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="sotw-btn sotw-btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    İptal
                  </button>
                  <button type="submit" className="sotw-btn sotw-btn-primary">
                    Filmi Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Kategori Filtreleme */}
        <div className="categories-bar">
          <div className="categories-list">
            {FILM_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Film Listesi */}
        {shortFilms.length === 0 ? (
          <div className="empty-state">
            <h3>Henüz hiç kısa film eklenmemiş</h3>
            <p>Yukarıdaki "Kısa Film Ekle" düğmesine tıklayarak favorite YouTube kısa filmlerinizi ekleyebilirsiniz.</p>
            <button 
              className="sotw-btn sotw-btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <PlusIcon className="btn-icon" />
              Kısa Film Ekle
            </button>
          </div>
        ) : selectedFilm ? (
          <FilmDetail film={shortFilms.find(film => film.id === selectedFilm)!} onClose={() => setSelectedFilm(null)} />
        ) : (
          <div className="films-grid">
            {filteredFilms.length === 0 ? (
              <div className="empty-category">
                <h3>Bu kategoride film bulunamadı</h3>
                <p>Başka bir kategori seçin veya yeni film ekleyin</p>
              </div>
            ) : (
              filteredFilms.map((film) => (
                <div key={film.id} className="film-card">
                  <div 
                    className="film-thumbnail-wrapper"
                    onClick={() => setSelectedFilm(film.id)}
                  >
                    <img 
                      src={film.thumbnail} 
                      alt={film.title} 
                      className="film-thumbnail" 
                    />
                    <div className="film-overlay">
                      {/* Beyaz oynat butonu kaldırıldı */}
                    </div>
                  </div>
                  
                  <div className="film-info">
                    <div className="film-meta">
                      <span className="film-category">{FILM_CATEGORIES.find(cat => cat.id === film.category)?.name || 'Diğer'}</span>
                      <button
                        onClick={(e) => handleLikeToggle(film.id, e)}
                        className={`like-toggle ${likedFilms.includes(film.id) ? 'active' : ''}`}
                        aria-label={likedFilms.includes(film.id) ? "Beğenildi" : "Beğen"}
                      >
                        {likedFilms.includes(film.id) ? (
                          <HeartIconSolid className="like-icon" style={{ width: '24px', height: '24px' }} />
                        ) : (
                          <HeartIcon className="like-icon" style={{ width: '24px', height: '24px' }} />
                        )}
                      </button>
                    </div>
                    <h3 className="film-title" onClick={() => setSelectedFilm(film.id)}>
                      {film.title}
                    </h3>
                    <p className="film-creator">{film.creator}</p>
                    <p className="film-description-short">
                      {film.description.length > 80 
                        ? film.description.substring(0, 80) + '...' 
                        : film.description}
                    </p>
                    <div className="film-actions">
                      <button
                        className="watch-now-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFilm(film.id);
                        }}
                      >
                        İzle
                      </button>
                      <button
                        className={`like-btn ${likedFilms.includes(film.id) ? 'active' : ''}`}
                        onClick={(e) => handleLikeToggle(film.id, e)}
                      >
                        {likedFilms.includes(film.id) ? (
                          <HeartIconSolid className="btn-icon" />
                        ) : (
                          <HeartIcon className="btn-icon" />
                        )}
                        {likedFilms.includes(film.id) ? 'Beğenildi' : 'Beğen'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Daha Fazla Film Bölümü */}
      <div className="upload-cta-section">
        <div className="container">
          <div className="upload-cta-content">
            <h2>Kendi Kısa Filminizi Paylaşın</h2>
            <p>YouTube videolarınızı ekleyerek filminizin daha çok kişiye ulaşmasını sağlayın ve geri bildirim alın.</p>
            <button 
              className="sotw-btn sotw-btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <PlusIcon className="btn-icon" />
              Kısa Film Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortFilmsPage; 