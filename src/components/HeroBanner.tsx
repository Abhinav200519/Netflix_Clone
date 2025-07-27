import { Movie } from "@/lib/tmdb";
import { tmdbService } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

interface HeroBannerProps {
  movie: Movie;
  onPlayClick: () => void;
  onInfoClick: () => void;
}

const HeroBanner = ({ movie, onPlayClick, onInfoClick }: HeroBannerProps) => {
  const backdropUrl = movie.backdrop_path 
    ? tmdbService.getImageUrl(movie.backdrop_path)
    : '/placeholder.svg';

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {movie.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 leading-relaxed line-clamp-3">
              {movie.overview}
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={onPlayClick}
                size="lg"
                className="bg-white text-black hover:bg-white/80 font-semibold"
              >
                <Play className="h-5 w-5 mr-2 fill-current" />
                Play
              </Button>
              
              <Button
                onClick={onInfoClick}
                variant="secondary"
                size="lg"
                className="bg-secondary/50 text-white border-white/20 hover:bg-secondary/70"
              >
                <Info className="h-5 w-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;