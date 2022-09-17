import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "react-query";
import { buildUrl, useRestContext } from "..";
import { IQuery } from "./types";

const Query = ({
  params,
  appendToUrl,
  path,
  options,
  cacheResponse,
  query,
}: IQuery) => {
  const { axios } = useRestContext();

  return useQuery<any>({
    queryKey: [path, query, appendToUrl, params],
    queryFn: async () => {
      const response = await axios.request({
        method: "GET",
        params,
        url: buildUrl({ path, query, append: appendToUrl }),
      });

      if (cacheResponse) {
        await AsyncStorage.setItem(
          cacheResponse.key,
          JSON.stringify(response.data)
        );
      }

      return response.data;
    },
    ...options,
  });
};

export function buildQuery(config: Omit<IQuery, "params" | "id">) {
  return (data?: Partial<IQuery>) => Query({ ...config, ...data });
}
