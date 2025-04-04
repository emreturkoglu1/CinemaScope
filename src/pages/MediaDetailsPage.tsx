import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getImageUrl } from '../services/api';
import { MediaDetails, Video, Cast, Image } from '../types';
import { StarIcon, CalendarIcon, BookmarkIcon, ClockIcon, UserIcon, CameraIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { useWatchlist } from '../context/WatchlistContext';

const MediaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mediaType = window.location.pathname.includes('/movie/') ? 'movie' : 'tv';
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(-1);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        let data: MediaDetails;
        
        if (mediaType === 'movie') {
          data = await getMovieDetails(parseInt(id));
        } else {
          data = await getTVDetails(parseInt(id));
        }
        
        setDetails(data);
        
        // Fragman videosu bul
        const trailer = data.videos?.results.find(
          (video: Video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        if (trailer) {
          setTrailerKey(trailer.key);
        }
        
        setError(null);
      } catch (err) {
        setError('Detaylar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Detay sayfası yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  const handleWatchlistToggle = () => {
    if (!details || !id) return;
    
    const numericId = parseInt(id);
    const type = mediaType === 'movie' ? 'movie' : 'tv';
    
    if (isInWatchlist(numericId, type)) {
      removeFromWatchlist(numericId, type);
    } else {
      addToWatchlist({
        id: numericId,
        media_type: type,
        title: details.title,
        name: details.name,
        poster_path: details.poster_path,
        vote_average: details.vote_average
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Bilinmiyor';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Büyük görseli kapat
  const closePhotoViewer = () => {
    setActivePhotoIndex(-1);
  };

  // Bir sonraki görsele geç
  const goToNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!details?.images?.backdrops) return;
    
    setActivePhotoIndex(prev => 
      prev >= details.images!.backdrops.length - 1 ? 0 : prev + 1
    );
  };

  // Bir önceki görsele geç
  const goToPrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!details?.images?.backdrops) return;
    
    setActivePhotoIndex(prev => 
      prev <= 0 ? details.images!.backdrops.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            height: '48px',
            width: '48px',
            borderRadius: '50%',
            borderTop: '2px solid var(--primary-color)',
            borderBottom: '2px solid var(--primary-color)'
          }}></div>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="container" style={{ padding: '32px 0' }}>
        <div style={{ 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          color: '#721c24', 
          padding: '12px 16px', 
          borderRadius: '4px' 
        }}>
          <strong>Hata!</strong>
          <span style={{ display: 'block', marginTop: '4px' }}>{error || 'İçerik bulunamadı.'}</span>
        </div>
      </div>
    );
  }

  const title = details.title || details.name || 'İsimsiz İçerik';
  const releaseDate = details.release_date || details.first_air_date;
  const inWatchlist = isInWatchlist(parseInt(id || '0'), mediaType === 'movie' ? 'movie' : 'tv');
  
  // Film görsellerini filtrele (geçerli olanları al)
  const backdrops = details.images?.backdrops?.filter(image => image.file_path) || [];
  
  // Eğer backdrops boşsa ve poster varsa, posteri galeri öğesi olarak ekleyelim
  if (backdrops.length === 0 && details.poster_path) {
    console.log("Galeri boş, poster görseli kullanılacak");
    backdrops.push({
      file_path: details.poster_path,
      aspect_ratio: 1.78,
      height: 1080,
      width: 1920,
      vote_average: 0,
      vote_count: 0
    });
  }
  
  // Aktörleri filtrele (resmi olanları öncelikle göster)
  const cast = details.credits?.cast
    .filter((actor, index) => actor.profile_path || index < 8)
    .slice(0, 8) || [];

  console.log('Galeri için backdrops sayısı:', backdrops.length);

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <div style={{ position: 'relative' }}>
        {details.backdrop_path && (
          <div style={{ 
            position: 'absolute', 
            inset: '0', 
            height: '500px', 
            overflow: 'hidden', 
            zIndex: -1 
          }}>
            <div style={{ 
              position: 'absolute', 
              inset: '0', 
              background: 'linear-gradient(to top, var(--background-dark), rgba(18, 18, 18, 0.3))', 
              zIndex: 10 
            }}></div>
            <img
              src={getImageUrl(details.backdrop_path, 'original')}
              alt={title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                objectPosition: 'center', 
                opacity: 0.4 
              }}
            />
          </div>
        )}

        <div style={{ 
          paddingTop: '24px', 
          paddingBottom: '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '32px', 
          position: 'relative', 
          zIndex: 10 
        }}>
          {/* Film Poster ve Detay Bölümü */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '30px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            {/* Film Posteri */}
            <div style={{ 
              flexShrink: 0, 
              width: '300px', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }}>
              <img 
                src={getImageUrl(details.poster_path, 'w500')} 
                alt={title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Film Bilgileri */}
            <div style={{ 
              flex: '1', 
              minWidth: '300px', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>{title}</h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon style={{ height: '20px', width: '20px', color: '#FFC107', marginRight: '4px' }} />
                  <span>
                    {details.vote_average.toFixed(1)} ({details.vote_count} oy)
                  </span>
                </div>
                
                {releaseDate && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon style={{ height: '20px', width: '20px', color: 'var(--text-muted)', marginRight: '4px' }} />
                    <span>{formatDate(releaseDate)}</span>
                  </div>
                )}
                
                {details.runtime && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ClockIcon style={{ height: '20px', width: '20px', color: 'var(--text-muted)', marginRight: '4px' }} />
                    <span>{Math.floor(details.runtime / 60)}sa {details.runtime % 60}dk</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {details.genres.map((genre) => (
                  <span 
                    key={genre.id} 
                    style={{ 
                      padding: '4px 12px', 
                      backgroundColor: 'var(--background-light)', 
                      borderRadius: '9999px', 
                      fontSize: '14px', 
                      color: 'var(--text-muted)' 
                    }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '16px', 
                lineHeight: '1.6', 
                marginBottom: '20px' 
              }}>
                {details.overview || 'Bu içerik için açıklama bulunmuyor.'}
              </p>

              <button
                onClick={handleWatchlistToggle}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '8px 16px', 
                  borderRadius: '9999px', 
                  border: `1px solid ${inWatchlist ? 'var(--primary-color)' : 'var(--text-muted)'}`,
                  color: inWatchlist ? 'var(--primary-color)' : 'var(--text-muted)',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  width: 'fit-content'
                }}
              >
                {inWatchlist ? (
                  <>
                    <BookmarkIcon style={{ height: '16px', width: '16px' }} />
                    <span>İzleme Listemde</span>
                  </>
                ) : (
                  <>
                    <BookmarkOutlineIcon style={{ height: '16px', width: '16px' }} />
                    <span>İzleme Listeme Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>            
            {trailerKey ? (
              <div style={{ marginTop: '32px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Fragman</h2>
                <div style={{ 
                  position: 'relative', 
                  paddingBottom: '56.25%', 
                  height: '0', 
                  overflow: 'hidden', 
                  borderRadius: '8px', 
                  maxWidth: '800px', 
                  margin: '0 auto' 
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title={`${title} Fragman`}
                    style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : null}
            
            {/* Oyuncu Listesi - Her durumda göster */}
            {cast.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <UserIcon style={{ height: '24px', width: '24px', color: 'var(--primary-color)', marginRight: '8px' }} />
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Oyuncular</h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '16px'
                }}>
                  {cast.map((actor) => (
                    <div key={actor.id} style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        margin: '0 auto 8px', 
                        backgroundColor: 'var(--background-light)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }}>
                        <img 
                          src={actor.profile_path 
                            ? getImageUrl(actor.profile_path, 'w185') 
                            : 'https://via.placeholder.com/185x278?text=No+Image'
                          } 
                          alt={actor.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/185x278?text=No+Image';
                          }}
                        />
                      </div>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{actor.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fotoğraf Galerisi - Her durumda göster */}
            {backdrops && backdrops.length > 0 ? (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CameraIcon style={{ height: '24px', width: '24px', color: 'var(--primary-color)', marginRight: '8px' }} />
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Fotoğraf Galerisi</h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                  gap: '16px',
                  marginBottom: '30px'
                }}>
                  {backdrops.slice(0, 6).map((image, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        aspectRatio: '16/9',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                      }}
                      onClick={() => setActivePhotoIndex(index)}
                    >
                      <img 
                        src={getImageUrl(image.file_path, 'w500')} 
                        alt={`${title} - Görsel ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: '0',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '12px'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}>
                        <span style={{ color: 'white', fontSize: '14px' }}>Büyütmek için tıklayın</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                marginTop: '30px', 
                marginBottom: '40px',
                padding: '20px', 
                backgroundColor: 'var(--background-light)', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <CameraIcon style={{ height: '40px', width: '40px', color: 'var(--text-muted)', marginBottom: '12px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Fotoğraf Galerisi</h2>
                <p style={{ color: 'var(--text-muted)' }}>Bu film için henüz fotoğraf galerisi bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Büyük görsel görüntüleyici */}
      {activePhotoIndex >= 0 && backdrops.length > 0 && (
        <div 
          style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={closePhotoViewer}
        >
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'white',
            fontSize: '32px',
            cursor: 'pointer',
            zIndex: 10
          }}>
            &times;
          </div>
          
          <div 
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            onClick={goToPrevPhoto}
          >
            &lt;
          </div>
          
          <div 
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            onClick={goToNextPhoto}
          >
            &gt;
          </div>
          
          <img 
            src={getImageUrl(backdrops[activePhotoIndex].file_path, 'original')} 
            alt={`${title} - Görsel ${activePhotoIndex + 1}`}
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
          
          <div style={{
            position: 'absolute',
            bottom: '16px',
            width: '100%',
            textAlign: 'center',
            color: 'white',
            fontSize: '14px'
          }}>
            {activePhotoIndex + 1} / {backdrops.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDetailsPage; 