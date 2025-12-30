"use server";

import { getRentedItemList, returnItem } from "@/api/return/returnService";
import { getCookieHeader } from "@/api/cookie.server";
import type { GroupedRentedListResponse } from "@/types/ReturnInterface";

/**
 * 대여 목록 조회 서버함수
 * @returns GroupedRentedListResponse
 */
export async function getRentedItemsAction(): Promise<GroupedRentedListResponse> {
  const cookieHeader = await getCookieHeader();
  return await getRentedItemList(cookieHeader);
}

export async function returnItemAction(id: number) {
  const cookieHeader = await getCookieHeader();
  return await returnItem(id, cookieHeader);
}
