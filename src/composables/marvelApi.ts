import { Path } from "@/types/marvel";
import type { Comics, Characters } from "@/types/marvel";

const apiKey = import.meta.env.VITE_APP_MARVEL_API_PUBLIC;
const MARVEL_API = `https://gateway.marvel.com/v1/public/`;
const API_SIGN = `apikey=${apiKey}`;
const ITEMS_PER_PAGE = 20;

interface ApiOptions {
  query?: string;
  page?: number;
}

export const useMarvelApi = async (
  path: Path,
  options: ApiOptions
): Promise<Comics | Characters> => {
  const pagination = getPagination(options.page);
  const query = getQuery(options.query);

  const requestURI = getRequestURI(path, query, pagination);
  return useFetch(requestURI);
};

const getPagination = (page?: number): string => {
  return page ? `&offset=${page * ITEMS_PER_PAGE}` : "";
};

const getQuery = (query?: string): string => {
  return query ? `&${query}` : "";
};

const getRequestURI = (
  path: Path,
  query: string,
  pagination: string
): string => {
  const apiPath = `${MARVEL_API}/${path}`;
  return `${apiPath}?${API_SIGN}${query}${pagination}`;
};

export const useFetch = async (
  requestURI: string
): Promise<Comics | Characters> => {
  const res = await fetch(requestURI);
  const jsonRes = await res.json();
  return jsonRes.data as Comics | Characters;
};

export const useComics = async (page: number = 0): Promise<Comics> => {
  try {
    return (await useMarvelApi(Path.COMICS, { page })) as Comics;
  } catch (error) {
    throw new Error("An error occured while trying to read comics");
  }
};

export const useCharacterSearch = async (
  query: string,
  page: number = 0
): Promise<Characters> => {
  try {
    return (await useMarvelApi(Path.CHARACTERS, {
      query: `nameStartsWith=${query}`,
      page,
    })) as Characters;
  } catch (error) {
    throw new Error("An error occured while trying to search comics");
  }
};
