import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/shared/Loading";
import Filters from "@/components/home/Filters";
const Product = dynamic(() => import("@/components/product/Product"), {
  loading: () => <Loading />,
});
const ProductPage = () => {
  return (
    <main>
      <Product />
      <Filters />
    </main>
  );
};

export default ProductPage;
