export type SortOrder = "asc" | "desc";

interface SearchSortOptions<T> {
  query: T;
  search?: string;
  searchQuery: (query: T, search: string) => T;
  sortQuery: (query: T, order: SortOrder) => T;
  order: SortOrder;
}

export const searchAndSort = <T>({
  query,
  search,
  searchQuery,
  sortQuery,
  order,
}: SearchSortOptions<T>): T => {
  const searchTerm = search?.trim();

  const filteredQuery = searchTerm ? searchQuery(query, searchTerm) : query;

  return sortQuery(filteredQuery, order);
};
