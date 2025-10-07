import { NextAuthOptions } from 'next-auth';
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

        async authorize(credentials: any): Promise<any> {
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

                return user;

            } catch (error : any) {
                throw new Error(error);
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