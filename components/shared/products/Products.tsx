"use client";
import React, { useEffect, useState } from "react";
import Product from "./Product";
import LoadingSpinner from "../LoadingSpinner";
import { Product as ProductType } from "@/interfaces/products";
import { Divider } from "@mui/material";

const Products = ({
  title,
  products,
}: {
  title: string;
  products: ProductType[];
}) => {
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <section className="w-full mx-auto py-8">
      <h2 className="text-lg font-bold mb-2 md:text-lg lg:text-xl">
        {title}
      </h2>
      <Divider className="bg-white"/>
      <div
        id="products"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
      >
        {products?.map((product: any) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
};

export default Products;
