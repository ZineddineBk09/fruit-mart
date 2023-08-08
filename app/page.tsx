import dynamic from "next/dynamic";
import Loading from "@/components/shared/Loading";
const Filters = dynamic(() => import("@/components/home/Filters"), {
  ssr: false,
  loading: () => <Loading />,
});
const Carousel = dynamic(() => import("@/components/home/Carousel"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function Home() {
  
  return (
    <main className="max-w-screen overflow-x-hidden">
      <Carousel />
      <Filters />
    </main>
  );
}
