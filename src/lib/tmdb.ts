const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
let TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
// Using a CORS proxy to bypass CORS restrictions

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string): Promise<any> {
    // Ensure endpoint starts with a single slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const separator = cleanEndpoint.includes('?') ? '&' : '?';
    const apiUrl = `${TMDB_BASE_URL}${cleanEndpoint}${separator}api_key=${TMDB_API_KEY}&language=en-US`;
    const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
    console.log('TMDB API URL:', apiUrl);
    console.log('Proxied URL:', proxiedUrl);
    
    try {
      const response = await fetch(proxiedUrl);
      console.log('TMDB Response status:', response.status);
      
      if (!response.ok) {
        console.error('TMDB API error:', response.status, response.statusText);
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('TMDB Response data:', data);
      return data;
    } catch (error) {
      console.error('TMDB Fetch error:', error);
      throw error;
    }
  }

  async getTrending(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/trending/movie/week');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getTrendingMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/trending/movie/week');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getPopularMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/popular');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getTopRated(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/top_rated');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getTopRatedMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/top_rated');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getUpcomingMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/movie/upcoming');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getPopularTVShows(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/tv/popular');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getTopRatedTVShows(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB('/tv/top_rated');
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getTVShowsByGenre(genreId: number): Promise<Movie[]> {
    const data = await this.fetchFromTMDB(`/discover/tv?with_genres=${genreId}`);
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    const data = await this.fetchFromTMDB(`/discover/movie?with_genres=${genreId}`);
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    return this.fetchFromTMDB(`/movie/${movieId}`);
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const data = await this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    return data && Array.isArray(data.results) ? data.results : [];
  }

  async getGenres(): Promise<Genre[]> {
    const data = await this.fetchFromTMDB('/genre/movie/list');
    return data.genres;
  }

  getImageUrl(path: string): string {
    return `${TMDB_IMAGE_BASE_URL}${path}`;
  }

  // Genre IDs for easy access
  static GENRES = {
    ACTION: 28,
    COMEDY: 35,
    HORROR: 27,
    DOCUMENTARY: 99
  };
}

export const tmdbService = new TMDBService();
export { TMDBService };
