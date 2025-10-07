// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import Nav from "@/components/Navbar";

// export default function FavoritesPage() {
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       const res = await fetch("/api/favorites");
//       if (res.ok) {
//         const data = await res.json();
//         setFavorites(data.favorites || []);
//       }
//       setLoading(false);
//     };
//     fetchFavorites();
//   }, []);

//   if (loading) return <p>Loading favorites...</p>;

//   return (
//     <>
//       <Nav />
//       <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {favorites.length === 0 ? (
//           <p>No favorite movies yet.</p>
//         ) : (
//           favorites.map((movie, idx) => (
//             <Card key={idx} className="shadow-lg">
//               <CardHeader>
//                 <CardTitle>{movie}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Movie ID: {movie}</p>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </>
//   )
// }


"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavoriteIds(data.favorites || []);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const moviePromises = favoriteIds.map(async (id) => {
          const res = await fetch(`/api/movies/${id}`);
          if (!res.ok) return null;
          return await res.json();
        });

        const results = await Promise.all(moviePromises);
        const validMovies = results.filter((m): m is Movie => m !== null);
        setFavoriteMovies(validMovies);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [favoriteIds]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading favorites...</p>
      </div>
    );

  return (
    <>
    <Nav />
      <div className="p-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {favoriteMovies.length === 0 ? (
          <p className="text-center text-lg font-medium mt-10">
            No favorite movies yet.
          </p>
        ) : (
          favoriteMovies.map((movie) => (
            <Card
              key={movie.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <Link href={`/movie/${movie.id}`}>
                <div className="relative w-full h-[25rem]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="text-lg font-semibold truncate">
                  {movie.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-800">
                  ⭐ Rating: {movie.vote_average}/10
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
