import { useEffect, useState } from "react";
import { Movie } from "@/lib/tmdb";
import { tmdbService } from "@/lib/tmdb";
import { youtubeService } from "@/lib/youtube";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Play, X, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal = ({ movie, isOpen, onClose }: MovieModalProps) => {
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [trailerVideoId, setTrailerVideoId] = useState<string | null>(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isInMyList, setIsInMyList] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (movie && isOpen) {
      // Fetch detailed movie info
      tmdbService.getMovieDetails(movie.id)
        .then(setMovieDetails)
        .catch(console.error);
      
      // Check if movie is in My List
      const savedMovies = localStorage.getItem('myList');
      if (savedMovies) {
        const myList = JSON.parse(savedMovies);
        setIsInMyList(myList.some((m: Movie) => m.id === movie.id));
      }
      
      // Reset trailer state
      setShowTrailer(false);
      setTrailerVideoId(null);
    }
  }, [movie, isOpen]);

  const handlePlayTrailer = async () => {
    if (!movie) return;
    
    setIsLoadingTrailer(true);
    try {
      const videoId = await youtubeService.searchTrailer(movie.title);
      if (videoId) {
        setTrailerVideoId(videoId);
        setShowTrailer(true);
      } else {
        toast({
          title: "Trailer not found",
          description: "Sorry, we couldn't find a trailer for this movie.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading trailer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const handleMyListToggle = () => {
    if (!movie) return;
    
    const savedMovies = localStorage.getItem('myList');
    let myList = savedMovies ? JSON.parse(savedMovies) : [];
    
    if (isInMyList) {
      // Remove from list
      myList = myList.filter((m: Movie) => m.id !== movie.id);
      setIsInMyList(false);
      toast({
        title: "Removed from My List",
        description: `${movie.title} has been removed from your list.`,
      });
    } else {
      // Add to list
      myList.push(movie);
      setIsInMyList(true);
      toast({
        title: "Added to My List",
        description: `${movie.title} has been added to your list.`,
      });
    }
    
    localStorage.setItem('myList', JSON.stringify(myList));
  };

  if (!movie) return null;

  const displayMovie = movieDetails || movie;
  const posterUrl = displayMovie.poster_path 
    ? tmdbService.getImageUrl(displayMovie.poster_path)
    : '/placeholder.svg';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="sr-only">
          <h2>{displayMovie.title}</h2>
        </DialogHeader>

        {showTrailer && trailerVideoId ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/75 text-white rounded-full"
              onClick={() => setShowTrailer(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={youtubeService.getEmbedUrl(trailerVideoId)}
                title={`${displayMovie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
              <img
                src={posterUrl}
                alt={displayMovie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {displayMovie.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {displayMovie.vote_average > 0 && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-foreground">{displayMovie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {displayMovie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(displayMovie.release_date).getFullYear()}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {displayMovie.genres && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {displayMovie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={handlePlayTrailer}
                    disabled={isLoadingTrailer}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isLoadingTrailer ? "Loading..." : "Play Trailer"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleMyListToggle}
                  >
                    {isInMyList ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        In My List
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add to My List
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {displayMovie.overview || "No overview available."}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;