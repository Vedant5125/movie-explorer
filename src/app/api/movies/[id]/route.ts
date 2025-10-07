import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "Missing TMDB API key" }, { status: 500 });
  }

  const movieId = params.id;

  try {
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`;
    
    const response = await fetch(tmdbUrl, {
      next: { revalidate: 3600 } // Revalidate after 1 hour
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch movie from TMDB: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error(`Movie Detail API error for ID ${movieId}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}