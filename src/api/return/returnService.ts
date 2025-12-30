import {axiosInstance} from "@/api/axiosInstance";
import type {GroupedRentedListResponse} from "@/types/ReturnInterface";

/**
 * 대여 목록 조회 axios
 * @param cookieHeader 브라우저 쿠키
 * @returns GroupedRentedListResponse
 */
export async function getRentedItemList(
    cookieHeader?: string
): Promise<GroupedRentedListResponse> {
  const res = await axiosInstance.get<GroupedRentedListResponse>(
      "/api/getRentedItemList",
      {
        headers: cookieHeader ? {Cookie: cookieHeader} : {}
      }
  );
  return res.data;
}

export async function returnItem(id: number, cookieHeader?: string) {
  const res = await axiosInstance.post(
      "/api/returnItem",
      {id},
      {
        headers: cookieHeader ? {Cookie: cookieHeader} : {}
      });
  return res.data;
}
