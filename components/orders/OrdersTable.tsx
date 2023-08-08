'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Order } from '@/interfaces/orders'
import { fetchOrders } from '@/utils'
import CancelModal from './CancelModal'
import { Tooltip } from '@mui/material'

const OrdersTable = () => {
  const [show, setShow] = useState<any>(null)
  // get Orders from firestore
  const [orders, setOrders] = useState<Order[]>([])

  const refreshTable = async () => {
    setOrders([])
    await fetchOrders(setOrders)
  }

  useEffect(() => {
    const refresh = async () => {
      await fetchOrders(setOrders)
    }
    refresh()
  }, [])

  return (
    <>
      <div className='w-full sm:px-6'>
        <div className='px-4 md:px-10 py-4 md:py-7'>
          <div className='sm:flex items-center justify-between'>
            <p className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800'>
              طلباتي
            </p>
            <div>
              <Link
                href='/'
                className='inline-flex sm:mr-3 mt-4 sm:mt-0 items-start justify-start px-6 py-3 bg-green-500 hover:bg-green-600 focus:outline-none rounded'
              >
                <p className='text-sm font-medium leading-none text-white'>
                  طلب جديد
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div className='bg-white shadow px-4 pt-4 md:pt-7 pb-5 overflow-y-auto'>
          <table className='w-full whitespace-nowrap'>
            <thead>
              <tr className='h-16 w-full text-sm leading-none text-gray-800'>
                <th className='font-normal text-right pr-4'>المنتجات</th>
                <th className='font-normal text-right pr-12'>الحالة</th>
                <th className='font-normal text-right pr-12'>التاريخ</th>
                <th className='font-normal text-right pr-20'>السعر الكلي</th>
                <th className='font-normal text-right pr-20'>تاريخ التسليم</th>
              </tr>
            </thead>
            <tbody className='w-full'>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className='h-20 text-sm leading-none text-gray-800 border-b border-t bg-white hover:bg-gray-100 border-gray-100'
                >
                  <td>
                    <div className='flex items-center'>
                      {order.order_items.map((item, index) => (
                        <Tooltip title={item?.name} key={index}>
                          <img
                            className='shadow-md w-8 h-8 rounded-full -mr-2'
                            src={item?.image}
                          />
                        </Tooltip>
                      ))}
                    </div>
                  </td>
                  <td className='pr-12 w-16'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.order_status === 'قيد الانتظار'
                          ? 'bg-yellow-400 text-white'
                          : order.order_status === 'تم التسليم'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-400 text-white'
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className='pr-12'>
                    <p className='font-medium'>
                      {new Date(
                        order.order_date.seconds * 1000
                      ).toLocaleDateString('ar', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </td>
                  <td className='pr-20'>
                    <p className='font-medium'>
                      {order.total_price.toFixed(2)} <small>دينار</small>
                    </p>
                  </td>
                  <td className='pr-20'>
                    <p className='font-medium'>
                      {/* order_date + 3 days */}
                      {new Date(
                        order.order_date.seconds * 1000 +
                          3 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString('ar', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className='text-xs leading-3 text-gray-600 mt-2'>
                      {/*  check first if order_date+3days is greater then today */}
                      {new Date(
                        order.order_date.seconds * 1000 +
                          3 * 24 * 60 * 60 * 1000
                      ).getTime() > new Date().getTime() ? (
                        <>
                          تبقى{' '}
                          {
                            // order_date + 3 days - today
                            Math.floor(
                              (new Date(
                                order.order_date.seconds * 1000 +
                                  3 * 24 * 60 * 60 * 1000
                              ).getTime() -
                                new Date().getTime()) /
                                (1000 * 3600 * 24)
                            )
                              .toString()
                              .replace('-', '')
                          }{' '}
                          أيام
                        </>
                      ) : (
                        <>
                          تم تسليم الطلب منذ{' '}
                          {
                            // today - order_date + 3 days
                            Math.floor(
                              (new Date().getTime() -
                                new Date(
                                  order.order_date.seconds * 1000 +
                                    3 * 24 * 60 * 60 * 1000
                                ).getTime()) /
                                (1000 * 3600 * 24)
                            )
                              .toString()
                              .replace('-', '')
                          }{' '}
                          أيام
                        </>
                      )}
                    </p>
                  </td>

                  <td className='px-7 2xl:px-0'>
                    {/* check if order is delivered or not to show cancel modal */}
                    {order.order_status === 'قيد الانتظار' ? (
                      <CancelModal
                        id={order.id}
                        refresh={refreshTable}
                        total={order.total_price.toFixed(0) as any}
                      />
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default OrdersTable
