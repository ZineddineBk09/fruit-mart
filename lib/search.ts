import { Product } from "@/interfaces/products";
import Fuse from "fuse.js";

const options = {
  isCaseSensitive: false,
  includeScore: false,
  shouldSort: true,
  includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1,
  location: 0,
  threshold: 0.6,
  distance: 100,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  fieldNormWeight: 1,
};

export const searchProducts = (list: Product[], pattern: string) => {
  const fuse = new Fuse(list, {
    ...options,
    keys: ["name", "description", "country", "brand"],
  });

  return fuse.search(pattern).map((item) => item.item);
};

export const searchOrders = (list: any[], pattern: string) => {
  const fuse = new Fuse(list, {
    ...options,
    keys: ["name", "email", "phone", "emirate", "area", "location"],
  });

  return fuse.search(pattern).map((item) => item.item);
};

export const searchUsers = (list: any[], pattern: string) => {
  const fuse = new Fuse(list, {
    ...options,
    keys: ["name", "email", "phone", "emirate", "area", "location"],
  });

  return fuse.search(pattern).map((item) => item.item);
};

export const searchAdmins = (list: any[], pattern: string) => {
  const fuse = new Fuse(list, {
    ...options,
    keys: ["name", "email"],
  });

  return fuse.search(pattern).map((item) => item.item);
};
