import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { movieId } = await req.json();
  if (!movieId) {
    return NextResponse.json({ error: "Movie ID required" }, { status: 400 });
  }

  try {
    await UserModel.updateOne(
      { _id: session.user.id },
      { $addToSet: { favoriteMovies: movieId } } 
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}
