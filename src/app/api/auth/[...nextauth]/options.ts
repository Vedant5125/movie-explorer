import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider  from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
        },

        async authorize(credentials): Promise<User | null> {
            await dbConnect();
            if (!credentials?.email || !credentials?.password){
                throw new Error("Please enter email and password");
            }

            try {
                const user = await UserModel.findOne({
                    email: credentials.email
                })
                if(!user){
                    throw new Error("No user with credentials found")
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                if(!isPasswordCorrect){
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error("Authentication failed");
            }
        }
    })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user.id = token._id as string;
            }
            return session
        }
    },
    pages: {
        signIn: '/signin'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}