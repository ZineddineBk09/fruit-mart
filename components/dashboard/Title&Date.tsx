'use client'
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";

type Props = {
  title: string;
  noSearch?: boolean;
  handleSearch?: (search: string) => void;
};

const TitleAndDate = ({ title, handleSearch }: Props) => {
  const router = useRouter();

  return (
    <div className="mb-4 w-full flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <div>
        <h3 className="text-2xl font-medium md:text-2xl lg:text-3xl">
          {title}
        </h3>
        <p className="text-light-dark-4 text-xs font-normal capitalize lg:text-sm">
          {new Date().toLocaleDateString("ar", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <SearchBar handleSearch={handleSearch} />
    </div>
  );
};

export default TitleAndDate;
