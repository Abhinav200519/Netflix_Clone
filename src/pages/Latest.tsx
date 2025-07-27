import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";
import { tmdbService } from "@/lib/tmdb";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import MovieModal from "@/components/MovieModal";

const Latest = () => {
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [latestTVShows, setLatestTVShows] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const [trending, popularTV, upcoming] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getPopularTVShows(),
          tmdbService.getUpcomingMovies(),
        ]);

        setLatestMovies(trending);
        setLatestTVShows(popularTV);
        setUpcomingMovies(upcoming);
      } catch (error) {
        console.error("Error fetching latest content:", error);
        toast({
          title: "Error",
          description: "Failed to load latest content. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [toast]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading latest content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 space-y-8">
        <div className="px-4 md:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Latest & Trending</h1>
        </div>
        
        <MovieRow
          title="Trending Now"
          movies={latestMovies}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Latest TV Shows"
          movies={latestTVShows}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Coming Soon"
          movies={upcomingMovies}
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

export default Latest;