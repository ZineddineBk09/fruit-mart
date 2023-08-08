'use client'
import {
  countFirestoreOrders,
  countFirestoreProducts,
  countFirestoreUsers,
} from '@/utils'
import dynamic from 'next/dynamic'
const DashboardStatsCard = dynamic(() => import('./DashboardStatsCard'), {
  ssr: false,
})

const DashboardStats = async () => {
  const stats = [
    {
      title: 'الطلبات الملغاة',
      value: await countFirestoreOrders('ملغي'),
    },
    {
      title: 'الطلبات المكتملة',
      value: await countFirestoreOrders('تم التسليم'),
    },
    {
      title: 'الطلبات قيد الانتظار',
      value: await countFirestoreOrders('قيد الانتظار'),
    },
    {
      title: 'المستخدمين',
      value: await countFirestoreUsers(),
    },
  ]

  // get the number of products and orders from firestore
  return (
    <section className='grid grid-cols-1 gap-4 w-full mx-auto sm:grid-cols-2'>
      {stats &&
        stats.map((stat, index) => (
          <DashboardStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            href={
              stat.title === 'المنتجات'
                ? '/products'
                : stat.title === 'الطلبات'
                ? '/orders'
                : '#'
            }
          />
        ))}
    </section>
  )
}

export default DashboardStats
