import { Movie } from "@/lib/tmdb";
import { tmdbService } from "@/lib/tmdb";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const imageUrl = movie.poster_path 
    ? tmdbService.getImageUrl(movie.poster_path)
    : '/placeholder.svg';

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-20 relative shadow-lg hover:shadow-2xl"
      onClick={onClick}
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-4">
        <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-3 w-3 fill-current" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          
          {movie.release_date && (
            <span className="text-muted-foreground">
              {new Date(movie.release_date).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;