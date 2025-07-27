import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";
import { tmdbService } from "@/lib/tmdb";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import MovieModal from "@/components/MovieModal";

const Movies = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [popular, topRated, action, comedy, horror] = await Promise.all([
          tmdbService.getPopularMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getMoviesByGenre(28), // Action
          tmdbService.getMoviesByGenre(35), // Comedy
          tmdbService.getMoviesByGenre(27), // Horror
        ]);

        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setActionMovies(action);
        setComedyMovies(comedy);
        setHorrorMovies(horror);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast({
          title: "Error",
          description: "Failed to load movies. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [toast]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading movies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 space-y-8">
        <div className="px-4 md:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Movies</h1>
        </div>
        
        <MovieRow
          title="Popular Movies"
          movies={popularMovies}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Top Rated Movies"
          movies={topRatedMovies}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Action Movies"
          movies={actionMovies}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Comedy Movies"
          movies={comedyMovies}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Horror Movies"
          movies={horrorMovies}
          onMovieClick={handleMovieClick}
        />
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Movies;