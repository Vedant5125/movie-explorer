"use client";

import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMovies = async (pageNum: number, searchQuery: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/movies?page=${pageNum}${searchQuery ? `&query=${searchQuery}` : ""}`
      );
      const data = await res.json();
      if (pageNum === 1) setMovies(data.results || []);
      else if (data.results?.length > 0) setMovies((prev) => [...prev, ...data.results]);
      else setHasMore(false);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page, query);
  }, [page, query]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
    setHasMore(true);
  };

  return (
    <>
      <Navbar onSearch={handleSearch}/>
      <Separator className="bg-slate-300 mt-3" />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-10 ml-[4%]">
          {query ? `Results for "${query}"` : "🎬 Popular Movies"}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 ml-[5%] mr-[5%]">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="bg-white shadow rounded-lg overflow-hidden hover:scale-105 transition">
                <div className="relative w-full h-[27rem]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h2 className="text-xl font-bold truncate ml-1">{movie.title}</h2>
                  <p className="text-sm text-indigo-800">⭐ Rating: {movie.vote_average}/10</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div ref={loaderRef} className="flex justify-center py-6">
            {loading && <p>Loading more...</p>}
          </div>
        )}
      </main>
    </>
  );
}
