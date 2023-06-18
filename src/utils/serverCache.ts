import cache from "memory-cache";

export const PutMemoryCache = (key: string, value: string) => {
    cache.put(key, value, 5400000);
};

export const getMemoryCache = (key: string) => {
    return cache.get(key);
};
