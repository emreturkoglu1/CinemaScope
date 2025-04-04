///Bu projede yer alan her Api ve Veriseti Eğitim Amaçlı Kullanılmıştır///

# 🎬 CinemaScope - Film ve Kısa Film Platformu

CinemaScope, film tutkunları için geliştirilmiş, modern ve kullanıcı dostu bir platformdur. Popüler filmleri keşfetme, izleme listenizi yönetme ve bağımsız kısa filmleri izleme imkanı sunar.

![CinemaScope](https://i.imgur.com/placeholder.png)

## ✨ Özellikler

- 🎥 TMDB API ile entegre edilen zengin film veritabanı
- 📱 Tamamen duyarlı (responsive) tasarım
- 💾 İzleme listesi, beğenilen filmler ve izlenen filmler için yerel depolama
- 🔍 Gelişmiş film arama ve filtreleme özellikleri
- 📊 Kullanıcı profili ve istatistikleri
- 📹 Bağımsız yapımcılar için kısa film yükleme ve paylaşma alanı
- ❤️ Beğenme, oylamak ve yapımcıları destekleme imkanı

## 🚀 Başlarken

### Gereksinimler
- Node.js (v14.0.0 veya üstü önerilir)
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/YOUR_USERNAME/cinemascope.git
cd cinemascope
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. `.env` dosyası oluşturun (veya `src/services/api.ts` dosyasını düzenleyin) ve TMDB API anahtarınızı ekleyin:
```
REACT_APP_TMDB_API_KEY=your_api_key_here
```

4. Uygulamayı başlatın:
```bash
npm start
# veya
yarn start
```

5. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyin.

## 🔑 TMDB API Anahtarı Alımı

Bu uygulama [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) kullanmaktadır. Çalışabilmesi için bir API anahtarına ihtiyacınız vardır:

1. [TMDB](https://www.themoviedb.org) sitesine kaydolun
2. [API ayarları](https://www.themoviedb.org/settings/api) sayfasından API anahtarı talep edin
3. Aldığınız API anahtarını `src/services/api.ts` dosyasındaki `API_KEY` değişkenine atayın

## 🛠️ Teknolojiler

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [TMDB API](https://www.themoviedb.org/documentation/api)

## 🎯 Proje Yapısı

```
src/
├── components/     # Yeniden kullanılabilir UI bileşenleri
├── context/        # React context tanımlamaları
├── hooks/          # Özel React hooks
├── pages/          # Ana sayfa bileşenleri
├── services/       # API ve veri servisleri
├── types/          # TypeScript tür tanımlamaları
└── utils/          # Yardımcı işlevler
```

## 📝 Yapılacaklar ve Gelecek Özellikler

- [ ] Kullanıcı hesapları ve kimlik doğrulama sistemi
- [ ] Çevrimiçi veritabanı entegrasyonu
- [ ] Sosyal medya bağlantıları
- [ ] Gelişmiş yorum sistemi
- [ ] Kısa filmler için oynatma ve izleme analitikleri


## 🙏 Teşekkürler

- [The Movie Database (TMDB)](https://www.themoviedb.org) - Sağladıkları API için
- [React ve ekosistemi](https://reactjs.org/) - Harika araçlar için

---

# 🎬 CinemaScope - Movie and Short Film Platform [English]

CinemaScope is a modern and user-friendly platform developed for movie enthusiasts. It offers the ability to discover popular movies, manage your watchlist, and watch independent short films.

## ✨ Features

- 🎥 Rich movie database integrated with TMDB API
- 📱 Fully responsive design
- 💾 Local storage for watchlists, liked movies, and watched movies
- 🔍 Advanced movie search and filtering features
- 📊 User profile and statistics
- 📹 Short film upload and sharing area for independent filmmakers
- ❤️ Like, vote, and support options for filmmakers

## 🚀 Getting Started

### Requirements
- Node.js (v14.0.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the project:
```bash
git clone https://github.com/YOUR_USERNAME/cinemascope.git
cd cinemascope
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file (or edit the `src/services/api.ts` file) and add your TMDB API key:
```
REACT_APP_TMDB_API_KEY=your_api_key_here
```

4. Start the application:
```bash
npm start
# or
yarn start
```

5. Navigate to `http://localhost:3000` in your browser to view the application.

## 🔑 Getting a TMDB API Key

This application uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api). You need an API key for it to work:

1. Sign up on the [TMDB](https://www.themoviedb.org) website
2. Request an API key from the [API settings](https://www.themoviedb.org/settings/api) page
3. Assign the API key you received to the `API_KEY` variable in the `src/services/api.ts` file

## 🛠️ Technologies

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [TMDB API](https://www.themoviedb.org/documentation/api)

## 📝 Upcoming Features

- [ ] User accounts and authentication system
- [ ] Online database integration
- [ ] Social media connections
- [ ] Advanced comment system
- [ ] Playback and viewing analytics for short films

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org) - For providing the API
- [React and its ecosystem](https://reactjs.org/) - For the great tools

---




