import cache from "memory-cache";

export const PutMemoryCache = (key: string, value: string) => {
    cache.put(key, value, 5400000);

    console.log(cache.get(key));
};
