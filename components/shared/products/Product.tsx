import React from "react";
import Image from "next/image";
import { Product } from "@/interfaces/products";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addItem,
  loadCart,
  removeItem,
  updateQuantity,
} from "@/redux/slices/cart";
import Link from "next/link";

const Product = ({ product }: { product: Product }) => {
  const {
    id,
    name,
    price,
    image,
    unit,
    country,
    brand,
    description,
    category,
    discount,
  } = product;
  const dispatch = useAppDispatch();

  // load cart from local storage
  //dispatch(loadCart());

  const selectedItem =
    useAppSelector((state) =>
      state.cart.items?.filter((item: any) => item.id == id)
    ) || [];

  const handleReduceQty = () => {
    if (selectedItem[0].quantity > 1) {
      dispatch(
        updateQuantity({
          id,
          quantity: selectedItem[0].quantity ? selectedItem[0].quantity - 1 : 1,
        })
      );
    } else {
      dispatch(removeItem(id));
    }
  };

  const handleIncreaseQty = () => {
    dispatch(
      updateQuantity({
        id,
        quantity: selectedItem[0].quantity ? selectedItem[0].quantity + 1 : 1,
      })
    );
  };

  return (
    <div className="w-full flex flex-col items-start justify-between mx-auto border rounded-xl shadow-md transition-all duration-300 hover:shadow-lg relative">
      <Link href="/products/1" className="w-full overflow-hidden rounded-t-xl">
        <Image
          src={image}
          alt={name}
          width={250}
          height={200}
          className="w-full object-cover transition-all duration-300 rounded-t-xl hover:scale-105 "
        />
      </Link>
      <div className="w-full flex flex-col items-start justify-between p-4">
        {/* discount */}
        {discount && (
          <span className="absolute top-2 left-2 w-10 h-6 flex items-center justify-center bg-amber-500 rounded text-white text-xs font-bold">
            {discount * 100}%-
          </span>
        )}
        <small className="text-gray-400 text-xs mt-3">{category}</small>
        <h3 className="text-slate-900 font-bold mt-2">{name}</h3>
        <p className="text-right text-xs text-gray-500 mt-2">
          {country ? country : brand}
        </p>
        <p className="text-right text-xs text-gray-500 mt-2 font-semibold">
          {unit}/{price}
        </p>
        <small className="text-gray-400 text-xs mt-4">
          {description.join(" - ")}
        </small>
        <div className="w-full flex items-end justify-between mt-2 ">
          <div className="flex flex-col items-start">
            {discount && (
              <p className="text-xs text-red-400 line-through">
                {(price + price * discount).toFixed(2)} دينار
              </p>
            )}
            <p className="text-right text-xs text-green-500 lg:text-sm">
              <span className="text-lg font-semibold lg:text-xl">{price}</span>{" "}
              دينار
            </p>
          </div>

          {/* If button in cart show the add/decrement buttons */}
          {selectedItem.length ? (
            <div className="w-24 flex items-center justify-between border rounded text-xs border-amber-500 text-center p-1 z-10">
              <button
                className="w-6 h-full m-auto text-sm transition-all duration-200 hover:bg-gray-200"
                onClick={handleReduceQty}
              >
                -
              </button>
              <span className="mx-2 text-sm font-bold">
                {selectedItem[0].quantity}
              </span>
              <button
                className="w-6 h-full m-auto  text-sm transition-all duration-200 hover:bg-gray-200"
                onClick={handleIncreaseQty}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="w-24 p-2 border rounded text-xs text-amber-500 border-amber-500 text-center transition-all duration-300 hover:text-white hover:bg-amber-500 z-10"
              onClick={() =>
                dispatch(
                  addItem({
                    ...product,
                    quantity: 1,
                  })
                )
              }
            >
              أضف إلى السلة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
