"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Images from "@/data/images";
import Image from "next/image";

const Carousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <div className="w-screen relative">
      <Slider {...settings}>
        {Images.map((item) => (
          <Slide key={item.id} src={item.src} alt={item.alt} />
        ))}
      </Slider>
      <div className="flex items-center justify-center absolute inset-0 text-5xl text-white z-10">
        <h1 className="self-center text-3xl font-semibold whitespace-nowrap dark:text-gray-100">
          FruitMart
        </h1>
      </div>
      <span className="flex items-center justify-center absolute bottom-5 inset-x-0 animate-bounce z-10">
        <ArrowBackIosIcon
          className="text-4xl text-green-500 -rotate-90 hover:cursor-pointer md:text-3xl lg:text-5xl z-10"
          // on click scroll to id products
          onClick={() => {
            const element = document.getElementById("products");
            element?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </span>
    </div>
  );
};

const Slide = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        width={500}
        height={500}
        className="w-full h-[500px] relative object-cover -z-10"
      />
      <div className="bg-black bg-opacity-5 absolute inset-0" />
    </div>
  );
};

export default Carousel;
