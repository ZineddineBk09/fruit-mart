"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { searchProducts } from "@/lib/search";
import { Product } from "@/interfaces/products";
import TitleAndDate from "@/components/dashboard/Title&Date";
import { fetchProducts } from "@/utils";
const ProductsTable = dynamic(
  () => import("@/components/dashboard/products/ProductsTable"),
  { ssr: false }
);

const ProductsPage = () => {
  // get products from firestore
  const [products, setProducts] = useState<Product[]>([]);

  const refreshTable = async () => {
    setProducts([]);
    await fetchProducts(setProducts);
  };
  
  useEffect(() => {
    const refresh = async () => {
      await fetchProducts(setProducts);
    };
    refresh();
  }, []);

  const handleSearchProducts = (search: string) => {
    if (search === "") {
      refreshTable();
      return;
    }
    // search inside shipments array
    const filteredProducts: any = searchProducts(products, search);
    setProducts(filteredProducts);
  };

  return (
    <div className="flex flex-col w-11/12 mx-auto items-start justify-between mt-8">
      {/* Title & Date */}
      <TitleAndDate
        title="المنتجات"
        handleSearch={handleSearchProducts}
        noSearch={false}
      />

      {/* Products */}
      <ProductsTable
        products={products ? products : []}
        isLoading={false}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default ProductsPage;
