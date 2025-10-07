"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Nav from "@/components/Navbar";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
}

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (session?.user && id) {
        const res = await fetch(`/api/favorites`);
        const data = await res.json();
        setIsFavorite(data.favoriteMovies?.includes(id));
      }
    };
    checkFavorite();
  }, [session, id]);

  const handleFavorite = async () => {
    if (!session) {
      alert("Please sign in to add favorites!");
      return;
    }

    try {
      const res = await fetch(`/api/favorites/add`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: id }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Failed to update favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  if (!movie)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600 font-semibold">
          Movie not found.
        </p>
      </div>
    );

  return (
    <>
    <Nav onSearch={handleSearch}/>
    <main className="p-6 md:p-12">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-1/3 h-[28rem]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
          <p className="text-gray-700 mb-4">{movie.overview}</p>
          <p className="text-sm text-gray-600 mb-2">
            Release Date: {movie.release_date}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Rating: ⭐ {movie.vote_average}/10
          </p>
          {movie.genres && (
            <p className="text-sm text-gray-600 mb-4">
              Genres: {movie.genres.map((g) => g.name).join(", ")}
            </p>
          )}

          <Button
            onClick={handleFavorite}
            className={`mt-4 px-6 py-2 text-white font-semibold rounded-lg ${
              isFavorite ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>
      </div>
    </main>
    </>
  );
}
