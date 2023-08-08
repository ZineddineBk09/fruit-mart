'use client'
import Logo from './Logo'
import SearchBar from './SearchBar'
import Cart from './Cart'
import Profile from './Profile'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const NavigationBar = () => {
  const { data: session, status } = useSession()
  return (
    <header className='w-full flex flex-col px-4 py-2 shadow-gray-200 shadow-lg transition-all duration-300 sm:px-7 md:px-10 lg:px-12'>
      <nav className={`h-20 w-full flex items-center justify-between`}>
        <Logo />

        <div className='w-full hidden md:block'>
          <SearchBar />
        </div>

        <div className='flex items-center justify-between'>
          <Cart />
          {session?.user && <Profile />}
        </div>

        {/* Auth/Register */}
        {!session?.user && (
          <div className='flex items-center justify-between'>
            <Link
              href='/login'
              prefetch
              className='text-xs text-gray-700 hover:text-gray-900 transition-all duration-200 md:text-sm'
            >
              تسجيل الدخول
            </Link>
            <Link
              href='/register'
              prefetch
              className='text-xs text-white font-semibold mr-2 bg-green-500 rounded-lg p-2 hover:bg-green-600 transition-all duration-200 md:text-sm'
            >
              إنشاء حساب
            </Link>
          </div>
        )}
      </nav>

      <div className='w-full block md:hidden'>
        <SearchBar />
      </div>
    </header>
  )
}

export default NavigationBar
