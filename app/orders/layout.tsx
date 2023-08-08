'use client'
import Loading from '@/components/shared/Loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const OrdersLayout = (props: React.PropsWithChildren<{}>) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <Loading />
  } else if (!session?.user) {
    router.push('/login')
  }
  
  return <>{props.children}</>
}

export default OrdersLayout
