import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import User from "@/model/User"
import { NextResponse } from "next/server"


export async function GET(){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    try {
        const user = await User.findOne({
            $or:[
                {_id: session.user.id},
                {email: session.user.email}
            ]
         });
        if(!user){
            return NextResponse.json({ error: "User not found"})
        }
        return NextResponse.json({ favorites: user.favoriteMovies  || []})
    } catch (error) {
        return NextResponse.json({ error: "Server error"});
    }
}