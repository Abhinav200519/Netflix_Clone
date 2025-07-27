import { useState, useEffect } from "react";
import { Movie, tmdbService, TMDBService } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import MovieModal from "@/components/MovieModal";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [documentaries, setDocumentaries] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all movie categories
        const [trending, topRated, action, comedy, horror, docs] = await Promise.all([
          tmdbService.getTrending(),
          tmdbService.getTopRated(),
          tmdbService.getMoviesByGenre(TMDBService.GENRES.ACTION),
          tmdbService.getMoviesByGenre(TMDBService.GENRES.COMEDY),
          tmdbService.getMoviesByGenre(TMDBService.GENRES.HORROR),
          tmdbService.getMoviesByGenre(TMDBService.GENRES.DOCUMENTARY),
        ]);

        setTrendingMovies(trending);
        setTopRatedMovies(topRated);
        setActionMovies(action);
        setComedyMovies(comedy);
        setHorrorMovies(horror);
        setDocumentaries(docs);

        // Set featured movie as the first trending movie
        if (trending.length > 0) {
          setFeaturedMovie(trending[0]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        toast({
          title: "Error loading movies",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [toast]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handlePlayClick = () => {
    if (featuredMovie) {
      setSelectedMovie(featuredMovie);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading movies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navbar />
      
      {/* Hero Banner */}
      {featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          onPlayClick={handlePlayClick}
          onInfoClick={() => setSelectedMovie(featuredMovie)}
        />
      )}

      {/* Movie Rows */}
      <div className="space-y-8 pb-16">
        <MovieRow
          title="Trending Now"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
        />
        
        <MovieRow
          title="Top Rated"
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
        
        <MovieRow
          title="Documentaries"
          movies={documentaries}
          onMovieClick={handleMovieClick}
        />
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

export default Index;
