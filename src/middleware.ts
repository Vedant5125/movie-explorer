import { NextResponse, NextRequest } from 'next/server'
export { default } from 'next-auth/middleware' 
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request, })
    const url = request.nextUrl

    if(token && 
        (
            url.pathname.startsWith('/login') ||
            url.pathname.startsWith('/register')
        )
    ){
        return NextResponse.redirect(new URL('/', request.url))
    }
    if(!token && 
        (
            url.pathname.startsWith('/movie/') || 
            url.pathname.startsWith('/favorite')
        )
    ){
        return NextResponse.redirect(new URL('/signin', request.url))
    }
}
 
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/movie/:path*',
    '/favorite'
]

}