'use client'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from "@heroui/react";
import { SearchInput } from "./Searchbar";
import { UserRound, LogOut } from 'lucide-react';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const Logo = () => {
  return (
      <Image
        src="/Movie-Exploror-Logo.png"
        alt="MovieExplorer Logo"
        width={200}
        height={50}
        className="rounded-md dark:invert"
      />
  );
};

export default function Nav({ onSearch }: { onSearch: (query: string) => void }) {
  const { data: session, status } = useSession();

  return (
    <Navbar shouldHideOnScroll className="flex justify-between p-3 h-[110px]">

      <NavbarBrand>
        <Link href="/" >
          <Logo />
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <SearchInput onSearch={onSearch} />
      </NavbarContent>

      <NavbarContent justify="end" className="gap-6 font-bold text-xl">

        <NavbarItem className="hidden lg:flex">
          <Link href="/favorite">❤️ Favorites</Link>
        </NavbarItem>

        {session ? (
          <>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 ">
                <UserRound />
                {session.user?.name || session.user?.email}
              </div>
              <Button  onClick={() => signOut()} className="hover:cursor-pointer text-red-700">
                <LogOut />
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/signin">Login</Link>
            </NavbarItem>

            <NavbarItem>
              <Button as={Link} className="bg-blue-400 rounded-4xl" color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}

      </NavbarContent>
    </Navbar>
  );
}
