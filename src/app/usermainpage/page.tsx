"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RentalList from "@/components/userMainPage/RentalList";
import Sidebar from "@/components/userMainPage/Sidebar";
import Header from "@/components/userMainPage/Header";
import { getSessionStatusAction } from "@/api/auth/auth.Server";
import { getRentedItemsAction } from "@/api/return/return.Server";
import {
  PageLayout,
  ContentArea,
  MainContainer,
  EmptyMessage
} from "@/style/UserMainPageStyle";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type {
  RentedListType,
  GroupedRentedListResponse
} from "@/types/ReturnInterface";
import type { RentalItem } from "@/types/UserMainPageInterface";

/* 유저 메인 페이지 컴포넌트 */
export default function UserMainScreen() {
  const router = useRouter();

  // 물품 상태별 state
  const [overdueItems, setOverdueItems] = useState<RentalItem[]>([]);
  const [dueSoonItems, setDueSoonItems] = useState<RentalItem[]>([]);
  const [rentedItems, setRentedItems] = useState<RentalItem[]>([]);

  const [visibleRentedCount, setVisibleRentedCount] = useState(5);

  /**
   * 세션 체크 함수
   * 세션이 유효하지 않으면 로그인 페이지로 이동
   */
  async function checkSession() {
    try {
      const data = await getSessionStatusAction();
      if (!data.ok) {
        toast.error("로그아웃되었습니다\n다시 로그인해주세요");
        router.replace("/login");
      }
    } catch {
      toast.error("로그아웃되었습니다\n다시 로그인해주세요");
      router.replace("/login");
    }
  }

  /**
   * 대여 물품 목록 조회 함수
   */
  async function fetchRentedItems() {
    try {
      const data: GroupedRentedListResponse = await getRentedItemsAction();

      const mapCheck = (items: RentedListType[]) =>
        items.map((item) => ({
          name: item.itemName,
          dueDate: item.daysRemaining
        }));

      setOverdueItems(mapCheck(data.overdue || []));
      setDueSoonItems(mapCheck(data.dueSoon || []));
      setRentedItems(mapCheck(data.normal || []));
    } catch (error) {
      console.error("Failed to fetch rented items:", error);
    }
  }

  // 페이지가 마운트 되면 checkSession 및 데이터 조회 실행
  useEffect(() => {
    checkSession();
    fetchRentedItems();
  }, []);

  const visibleRentedItems = rentedItems.slice(0, visibleRentedCount);
  const hasMoreRented = visibleRentedCount < rentedItems.length;

  /**
   * 무한 스크롤 감시 Ref
   */
  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      setVisibleRentedCount((prev) => prev + 5);
    }
  });

  return (
    <PageLayout>
      <Sidebar currentPath="/usermainpage" />
      <ContentArea>
        <Header />
        <MainContainer>
          {overdueItems.length === 0 &&
          dueSoonItems.length === 0 &&
          rentedItems.length === 0 ? (
            <EmptyMessage>
              <span className="material-icons-outlined">inventory_2</span>
              대여중인 물품이 없습니다.
            </EmptyMessage>
          ) : (
            <>
              {overdueItems.length > 0 && (
                <RentalList
                  icon="error_outline"
                  title="연체"
                  items={overdueItems}
                  rentalStatus="overdue"
                  cardHref="/return"
                />
              )}

              {dueSoonItems.length > 0 && (
                <RentalList
                  icon="watch_later"
                  title="만기 임박"
                  items={dueSoonItems}
                  rentalStatus="dueSoon"
                  cardHref="/return"
                />
              )}

              {rentedItems.length > 0 && (
                <>
                  <RentalList
                    icon="inventory_2"
                    title="대여 중"
                    items={visibleRentedItems}
                    rentalStatus="rented"
                    cardHref="/return"
                  />
                  {hasMoreRented && (
                    <div ref={loadMoreRef} style={{ height: "10px" }} />
                  )}
                </>
              )}
            </>
          )}
        </MainContainer>
      </ContentArea>
    </PageLayout>
  );
}
