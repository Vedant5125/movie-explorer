import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const query = searchParams.get("query");

  const url = query
    ? `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`
    : `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
