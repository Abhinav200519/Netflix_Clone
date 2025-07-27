import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Movie, tmdbService } from "@/lib/tmdb";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import Navbar from "@/components/Navbar";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await tmdbService.searchMovies(query);
      setMovies(results);
    } catch (error) {
      console.error('Search error:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    // Update URL
    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      <div className="pt-20 container mx-auto px-4 md:px-8">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg bg-card border-border focus:ring-primary"
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-muted-foreground">Searching...</div>
            </div>
          ) : searchQuery && movies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-muted-foreground">
                No movies found for "{searchQuery}"
              </div>
            </div>
          ) : movies.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold text-foreground">
                Search Results for "{searchQuery}" ({movies.length})
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))}
              </div>
            </>
          ) : !searchQuery ? (
            <div className="text-center py-12">
              <div className="text-lg text-muted-foreground">
                Enter a movie title to search
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};

export default Search;