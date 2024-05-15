import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/articlesService";

/**
 * Custom hook for fetching categories.
 * @returns An object containing the fetched categories.
 */
export const useCategories = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return { categories };
};
