'use client'

import Image from 'next/image'
import SearchBar from '../input/SearchBar'
import NavButtonLink from './NavButtonLink'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

// The same five links are shown inline in the desktop nav and as a fixed
// bottom bar on mobile — kept in one place so the two don't drift apart.
const MiddleNavLinks = ({ pathname }: { pathname: string }) => (
    <>
        <NavButtonLink
            href='/renter'
            alt='home icon'
            label='Dashboard'
            active={pathname === '/renter'}
            icon='/svgs/nav/home-active.svg'
            inactiveIcon='/svgs/nav/home.svg'
        />

        <NavButtonLink
            href='/renter/rentals'
            label='Rentals'
            alt='folder icon'
            icon='/svgs/nav/folder-active.svg'
            inactiveIcon='/svgs/nav/folder.svg'
            active={pathname.startsWith('/renter/rentals')}
        />

        <NavButtonLink
            href='/renter/wallet'
            active={pathname === '/renter/wallet'}
            label='Wallet'
            alt='wallet icon'
            icon='/svgs/nav/wallet-active.svg'
            inactiveIcon='/svgs/nav/wallet.svg'
        />

        <NavButtonLink
            href='/messages'
            label='Messages'
            alt='messages icon'
            active={pathname === '/messages'}
            icon='/svgs/nav/messages-active.svg'
            inactiveIcon='/svgs/nav/messages.svg'
        />

        <NavButtonLink
            href='/renter/settings'
            alt='settings'
            label='Settings'
            icon='/svgs/nav/user-active.svg'
            active={pathname.startsWith('/renter/settings')}
            inactiveIcon='/svgs/nav/user.svg'
        />
    </>
)

const NavBar = ({ location }: { location: string }) => {
    const pathname = usePathname()
    const { isSignedIn } = useUser();

    return (
        <>
            <nav className='flex justify-between my-6'>

                {/* Left */}
                <div className='flex gap-1 items-center'>
                    <Image
                        height={48}
                        width={62.03}
                        alt='rentrospect logo'
                        src='/svgs/rentrospect.svg'
                    />

                    <Image
                        width={44}
                        height={44}
                        alt='location svg'
                        src='/svgs/location.svg'
                        className='p-3'
                    />

                    <div className='flex flex-col'>
                        <p className='text-[#808493] dmSans-font text-[12px] leading-5.5'>
                            Your location
                        </p>

                        <p className='text-black dmSans-font text-sm'>
                            {location}
                        </p>
                    </div>
                </div>

                {/* Middle Nav — desktop only; the mobile version is a fixed bottom bar, rendered below */}
                <div className='hidden md:flex p-2 gap-4 bg-[#00000033] z-2 rounded-[2.5rem]'>
                    <MiddleNavLinks pathname={pathname} />
                </div>

                {/* Right */}
                <div className='flex gap-4 items-center'>
                    <Image
                        width={20}
                        height={20}
                        alt='search icon'
                        src='/svgs/search.svg'
                        className='hidden md:flex'
                    />

                    <Image
                        width={20}
                        height={20}
                        alt='bell icon'
                        src='/svgs/bell.svg'
                    />

                    <Image
                        width={20}
                        height={20}
                        alt='heart icon'
                        src='/svgs/heart.svg'
                    />

                    {isSignedIn ? (
                        <div className="flex items-center gap-4">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-64 h-64", // 48px
                                    },
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </>
                    )}
                </div>
            </nav>
            <SearchBar />

            {/* Middle Nav — mobile only, pinned to the bottom of the screen instead of inline at the top.
                Tighter gap than the desktop pill, plus overflow-x-auto as a safety net on narrow phones
                since one item's label expands when active. */}
            <div className='flex md:hidden fixed bottom-4 inset-x-4 z-40 justify-center gap-1 p-2 bg-[#00000033] rounded-[2.5rem] overflow-x-auto'>
                <MiddleNavLinks pathname={pathname} />
            </div>
        </>
    )
}

export default NavBar