import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo we will take care of pagination
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number of items on the page from the cache.
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check for existing items in the cache.
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // if last page and item count !== pageCount return items
      if (items.length && items.length !== first && page == pages) {
        return items;
      }

      // If no items -> go to network to fetch them.
      if (items.length !== first) {
        return false;
      }

      // if items -> return items from cache
      if (items.length) {
        return items;
      }

      return false; // fallback to network.
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the Apollo client comes back from the network with our product.
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log('merged', merged);

      // Return merged items from the cache.
      return merged;
    },
  };
}
