'use client'
import Link from 'next/link'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className='bg-white rounded-lg shadow dark:bg-green-800 m-4'>
      <div className='w-full max-w-screen-xl mx-auto p-4 md:py-8'>
        <div className='sm:flex sm:items-center sm:justify-between'>
          <Link href='/' className='flex items-center mb-4 sm:mb-0'>
            <>
              <Logo />
              <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-gray-100 lg:-mr-8'>
                FruitMart
              </span>
            </>
          </Link>
          <ul className='flex flex-wrap items-center mb-6 text-sm font-medium text-gray-100 sm:mb-0'>
            <li>
              <Link href='#' className='ml-4 hover:underline md:ml-6 '>
                معلومات عنا
              </Link>
            </li>
            <li>
              <Link href='#' className='ml-4 hover:underline md:ml-6'>
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link href='#' className='ml-4 hover:underline md:ml-6 '>
                الترخيص
              </Link>
            </li>
            <li>
              <Link href='#' className='hover:underline'>
                اتصل بنا
              </Link>
            </li>
          </ul>
        </div>
        <hr className='my-6 border-green-200 sm:mx-auto dark:border-green-700 lg:my-8' />
        <span className='block text-sm text-gray-100 text-center'>
          كل الحقوق محفوظة .
          <Link href='https://flowbite.com/' className='hover:underline'>
            FruitMart™
          </Link>
          <span>2023 ©</span>
        </span>
      </div>
    </footer>
  )
}

export default Footer
