// use https://restcountries.com/v3.1/all countries api to get all countries name in arabic and flag
// return array of countries name and flag

import { useEffect, useState } from "react";

export function useGetCountries() {
  const [countries, setCountries] = useState<any[]>([]);
  useEffect(() => {
    async function getCountries() {
      await fetch("https://restcountries.com/v3.1/all")
        .then((res) => res.json())
        .then((data) => {
          // remove israel from countries
          const countries = data
            .filter((country: any) => country.cca3 !== "ISR")
            .map((country: any) => {
              return {
                id: country.cca3,
                name: country.translations.ara.common || country.name.common,
                flag: country.flag,
              };
            });
          setCountries(countries);
        });
    }
    getCountries();
  }, []);
  return countries;
}