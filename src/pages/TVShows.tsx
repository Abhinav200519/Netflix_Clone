import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";
import { tmdbService } from "@/lib/tmdb";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import MovieModal from "@/components/MovieModal";

const TVShows = () => {
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<Movie[]>([]);
  const [actionTVShows, setActionTVShows] = useState<Movie[]>([]);
  const [comedyTVShows, setComedyTVShows] = useState<Movie[]>([]);
  const [dramaTVShows, setDramaTVShows] = useState<Movie[]>([]);
  const [selectedShow, setSelectedShow] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        const [popular, topRated, action, comedy, drama] = await Promise.all([
          tmdbService.getPopularTVShows(),
          tmdbService.getTopRatedTVShows(),
          tmdbService.getTVShowsByGenre(10759), // Action & Adventure
          tmdbService.getTVShowsByGenre(35), // Comedy
          tmdbService.getTVShowsByGenre(18), // Drama
        ]);

        setPopularTVShows(popular);
        setTopRatedTVShows(topRated);
        setActionTVShows(action);
        setComedyTVShows(comedy);
        setDramaTVShows(drama);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        toast({
          title: "Error",
          description: "Failed to load TV shows. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [toast]);

  const handleShowClick = (show: Movie) => {
    setSelectedShow(show);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading TV shows...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 space-y-8">
        <div className="px-4 md:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">TV Shows</h1>
        </div>
        
        <MovieRow
          title="Popular TV Shows"
          movies={popularTVShows}
          onMovieClick={handleShowClick}
        />
        
        <MovieRow
          title="Top Rated TV Shows"
          movies={topRatedTVShows}
          onMovieClick={handleShowClick}
        />
        
        <MovieRow
          title="Action & Adventure"
          movies={actionTVShows}
          onMovieClick={handleShowClick}
        />
        
        <MovieRow
          title="Comedy Shows"
          movies={comedyTVShows}
          onMovieClick={handleShowClick}
        />
        
        <MovieRow
          title="Drama Shows"
          movies={dramaTVShows}
          onMovieClick={handleShowClick}
        />
      </div>

      {selectedShow && (
        <MovieModal
          movie={selectedShow}
          isOpen={!!selectedShow}
          onClose={() => setSelectedShow(null)}
        />
      )}
    </div>
  );
};

export default TVShows;