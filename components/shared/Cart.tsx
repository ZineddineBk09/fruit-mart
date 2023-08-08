"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { loadCart, removeItem } from "@/redux/slices/cart";
import Link from "next/link";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // load cart from local storage
  //dispatch(loadCart());

  const total = useAppSelector((state) => state.cart.total) || 0;
  const numberOfItems =
    useAppSelector((state) => state.cart.numberOfItems) || 0;
  const items = useAppSelector((state) => state.cart.items) || [];

  return (
    <button
      className="flex flex-col items-center relative"
      onClick={() => setOpen(true)}
    >
      <span className="absolute right-1 top-0 w-5 h-5 flex items-center justify-center bg-green-100 rounded text-green-500 text-xs">
        {numberOfItems}
      </span>
      <ShoppingBagIcon className="text-green-500 w-8 h-8" />
      <span className="text-gray-500 font-semibold mt-1 text-xs">
        {total.toFixed(2)} دينار
      </span>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-600"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-600"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            عربة التسوق
                          </Dialog.Title>
                          <div className="mr-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">إغلاق عربة التسوق</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {items.map((product: any) => (
                                <CartItem key={product.id} product={product} />
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>المجموع</p>
                          <p>
                            {total.toFixed(2)} <small>دينار</small>
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          الشحن والضرائب محسوبة عند الدفع.
                        </p>
                        <div className="mt-6">
                          <Link
                            href={numberOfItems === 0 ? "#" : "/checkout"}
                            className={
                              "flex items-center justify-center rounded-md border border-transparent bg-green-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-600" +
                              (numberOfItems === 0
                                ? " cursor-not-allowed opacity-50"
                                : "")
                            }
                          >
                            تمرير الطلب
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            أو{" "}
                            <button
                              type="button"
                              className="font-medium text-green-500 hover:text-green-500"
                              onClick={() => setOpen(false)}
                            >
                              متابعة التسوق
                              <span aria-hidden="true"> &larr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </button>
  );
};

const CartItem = ({ product }: { product: any }) => {
  const dispatch = useAppDispatch();
  return (
    <li key={product.id} className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          width={24}
          height={24}
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="mr-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link href={"/"}>{product.name}</Link>
            </h3>
            <p className="mr-4">
              {product.price} <small>دينار</small>
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{product.country}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">الكمية: {product.quantity}</p>

          <div className="flex">
            <button
              type="button"
              className="font-medium text-red-600 hover:text-red-500"
              onClick={() => dispatch(removeItem(product.id))}
            >
              إزالة
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Cart;
