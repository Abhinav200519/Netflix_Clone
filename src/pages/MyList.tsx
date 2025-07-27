import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";

const MyList = () => {
  const [myListMovies, setMyListMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const savedMovies = localStorage.getItem('myList');
    if (savedMovies) {
      setMyListMovies(JSON.parse(savedMovies));
    }
  }, []);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const removeFromList = (movieId: number) => {
    const updatedList = myListMovies.filter(movie => movie.id !== movieId);
    setMyListMovies(updatedList);
    localStorage.setItem('myList', JSON.stringify(updatedList));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 md:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My List</h1>
        
        {myListMovies.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl text-muted-foreground mb-4">Your list is empty</h2>
            <p className="text-muted-foreground">Add movies and TV shows to your list to watch them later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {myListMovies.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                />
                <button
                  onClick={() => removeFromList(movie.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
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

export default MyList;