import dynamic from 'next/dynamic'
const Navbar = dynamic(() => import('@/components/shared/Navbar'), {
  ssr: false,
  loading: () => <Loading />,
})
import './globals.css'
import { Noto_Kufi_Arabic } from 'next/font/google'
import Footer from '@/components/shared/Footer'
import { ReduxProvider } from '@/redux/provider'
import Loading from '@/components/shared/Loading'
import Navigation from '@/components/shared/Navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { NextAuthProvider } from './providers'
import Link from 'next/link'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Noto_Kufi_Arabic({ subsets: ['arabic'] })

export const metadata = {
  title: 'Fruit Mart',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ar' dir='rtl'>
      <GoogleAnalytics />
      <body className={inter.className + ' overflow-x-hidden'}>
        <NextAuthProvider>
          <ToastContainer
            position='bottom-left'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
          <ReduxProvider>
            <Navbar />
            <Navigation />
            <main className='w-full min-h-[90vh] flex flex-col justify-evenly'>
              {children}
              <Footer />
            </main>
          </ReduxProvider>
          <div className='w-full text-center text-xs mb-2'>
            Developed by{' '}
            <Link
              href='https://www.linkedin.com/in/zineddine-benkhaled-b9b1a8195/'
              className='text-green-500 hover:underline'
              target='_blank'
            >
              Zinddine Benkhaled
            </Link>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
}
