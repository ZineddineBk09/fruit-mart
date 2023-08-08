'use client'
import { products } from '@/data/products'
import { Product as ProductType } from '@/interfaces/products'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addItem, removeItem, updateQuantity } from '@/redux/slices/cart'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React from 'react'

const Product = () => {
  const product: ProductType = products[2]
  const {
    id,
    name,
    description,
    price,
    country,
    brand,
    image,
    unit,
    discount,
    category,
  }: ProductType = product
  const dispatch: any = useAppDispatch()
  const selectedItem = useAppSelector((state) =>
    state.cart.items.filter((item) => item.id == id)
  )

  const handleReduceQty = () => {
    if (selectedItem[0].quantity > 1) {
      dispatch(
        updateQuantity({
          id,
          quantity: selectedItem[0].quantity ? selectedItem[0].quantity - 1 : 1,
        })
      )
    } else {
      dispatch(removeItem(id))
    }
  }

  const handleIncreaseQty = () => {
    dispatch(
      updateQuantity({
        id,
        quantity: selectedItem[0].quantity ? selectedItem[0].quantity + 1 : 1,
      })
    )
  }

  return (
    <div className='w-11/12 mx-auto h-fit grid grid-cols-1 justify-center items-center mt-8 md:grid-cols-2'>
      <div className='w-4/5 flex flex-col items-start justify-between p-4 mx-auto'>
        <small className='text-gray-400 text-xl mt-3'>{category}</small>
        <h3 className='text-3xl text-slate-900 font-bold mt-2'>{name}</h3>
        <p className='text-right text-xl text-gray-500 mt-2'>
          {country ? country : brand}
        </p>
        <p className='text-right text-xl text-gray-500 mt-4 font-semibold'>
          {unit}/{price}
        </p>
        <small className='text-gray-400 mt-4'>
          لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو
          أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا .
        </small>
        <div className='w-full flex items-end mt-4'>
          <div className='flex flex-col items-start ml-8'>
            {discount && (
              <p className='text-lg text-red-400 line-through'>
                {(price + price * 0.1).toFixed(2)} دينار
              </p>
            )}
            <p className='text-right text-3xl text-green-500 lg:text-sm'>
              <span className='text-xl font-semibold lg:text-3xl'>{price}</span>{' '}
              دينار
            </p>
          </div>

          {discount && (
            <span className='w-16 h-8 flex items-center justify-center p-1 text-amber-500 bg-amber-500/20 rounded text-lg font-bold'>
              {0.1 * 100 + '%-'}
            </span>
          )}
        </div>
        {selectedItem.length > 0 ? (
          <div className='w-52 h-12  flex items-center justify-between border rounded text-xs border-amber-500 text-center p-1 mt-4 z-10'>
            <button
              className='w-6 h-full m-auto text-lg transition-all duration-200 hover:bg-gray-200'
              onClick={handleReduceQty}
            >
              -
            </button>
            <span className='mx-2 text-lg font-bold'>
              {selectedItem[0]?.quantity || 0}
            </span>
            <button
              className='w-6 h-full m-auto  text-lg transition-all duration-200 hover:bg-gray-200'
              onClick={handleIncreaseQty}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className='w-52 h-12 flex items-center justify-around p-2 mt-4 border rounded text-lg text-amber-500 border-amber-500 text-center transition-all duration-300 hover:text-white hover:bg-amber-500'
            onClick={() =>
              dispatch(
                addItem({
                  ...products[2],
                  quantity: 1,
                })
              )
            }
          >
            <p>أضف إلى السلة</p>
            <ShoppingBagIcon className='text-xs w-8 h-8' />
          </button>
        )}
      </div>
      <div className='w-3/5 mx-auto flex flex-col justify-center items-center md:mr-auto'>
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className='object-cover w-full transition-all duration-300 rounded-xl'
        />
        <div className='w-full flex items-center justify-center mt-4 gap-1'>
          {/* display omage 4 times */}
          {[1, 2, 3, 4].map((_, i) => (
            <Image
              key={i}
              src={image}
              alt={name}
              width={50}
              height={50}
              className='w-20 h-20 object-cover transition-all duration-300 rounded-xl'
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export default Product
