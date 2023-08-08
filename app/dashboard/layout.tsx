'use client'
import Sidebar from '@/components/dashboard/Sidebar'
import Loading from '@/components/shared/Loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const DashboardLayout = (props: React.PropsWithChildren<{}>) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <Loading />
  } else if (!session?.user) {
    router.push('/login')
  } else if (session?.user?.role !== 'admin') {
    router.push('/')
  }

  return (
    <div className='w-full flex flex-col items-start justify-between my-4 p-4 md:flex-row'>
      <Sidebar />
      {props.children}
    </div>
  )
}

export default DashboardLayout
