"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react";
import Sidebar from "@/components/userMainPage/Sidebar";
import Header from "@/components/userMainPage/Header";
import {
  Card,
  ContentArea,
  EmptyRow,
  FilterRow,
  MainContainer,
  ModalButton,
  ModalContainer,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PageLayout,
  ReturnButton,
  SearchIconButton,
  SearchInput,
  SearchWrapper,
  StatusPill,
  Table,
  TableBodyCell,
  TableBodyCellName,
  TableBodyCellRight,
  TableBodyRow,
  TableContainer,
  TableHeadCell,
  TableHeadCellName,
  TableHeadRow
} from "@/style/ReturnStyle";
import type {RentedListType} from "@/types/ReturnInterface";
import {
  getRentedItemsAction,
  returnItemAction
} from "@/api/return/return.Server";
import toast, {Toaster} from "react-hot-toast";
import {getSessionStatusAction} from "@/api/auth/auth.Server";
import {useRouter} from "next/navigation";

export default function ReturnPage() {
  const router = useRouter();
  const [items, setItems] = useState<RentedListType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const isLoadingRef = useRef(false); // 중복 쿼리 방지용으로 useRef 사용

  // 모달 관련 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentedListType | null>(null);

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
   * 페이지가 로딩되면 세션체크 + 대여목록 정보 받아오기
   */
  useEffect(() => {
    checkSession();
    const fetchData = async () => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        setLoading(true);
        const data = await getRentedItemsAction();
        const allItems = [
          ...(data.overdue || []),
          ...(data.dueSoon || []),
          ...(data.normal || [])
        ];
        setItems(allItems);
      } catch (error) {
        console.error("Failed to fetch rented items:", error);
        toast.error("대여 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };
    fetchData();
  }, []);

  /**
   * 프론트엔드에서 검색어로 필터링된 목록
   * 어차피 반납물품 목록은 그렇게 많지 않아서 일단 전부 불러오고 실시간으로 검색하는 방식으로 구현
   * 부분적으로 불러오는 방법도 생각했지만 어차피 유저메인페이지에서 전부 보여줘야하기때문에
   * 리스트를 전부 받아오는 방식으로 결정했습니다
   */
  const filteredItems = useMemo(() => {
    if (!searchInput.trim()) {
      return items;
    }
    return items.filter((item) =>
        item.itemName.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [items, searchInput]);

  /**
   * 엔터키 입력 시 검색 실행
   */
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  /**
   * 반납 모달 열기
   */
  const handleReturnClick = (item: RentedListType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  /**
   * 반납 모달 닫기
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  /**
   * 반납처리
   */
  const handleConfirmReturn = useCallback(async () => {
    if (!selectedItem) return;

    try {
      await returnItemAction(selectedItem.id);
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      toast.success("반납되었습니다.");
      handleCloseModal();
    } catch {
      toast.error("반납 처리에 실패했습니다.");
    }
  }, [selectedItem]);

  /**
   * 모달이 열렸을 때 Enter로 반납시행/ Esc로 모달닫기
   */
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleConfirmReturn();
      } else if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleConfirmReturn]);

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
      <PageLayout>
        <Sidebar currentPath="/return"/>
        <ContentArea>
          <Header/>
          <MainContainer>
            <Toaster/>
            <Card>
              <FilterRow>
                <SearchWrapper>
                  <SearchInput
                      placeholder="물품 이름을 입력하세요"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                  />
                  <SearchIconButton aria-label="검색">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </SearchIconButton>
                </SearchWrapper>
              </FilterRow>

              <TableContainer>
                <Table>
                  <thead>
                  <TableHeadRow>
                    <TableHeadCellName $width="30%">
                      물품 이름
                    </TableHeadCellName>
                    <TableHeadCell $width="15%">대여 수량</TableHeadCell>
                    <TableHeadCell $width="20%">대여일</TableHeadCell>
                    <TableHeadCell $width="20%">반납 예정일</TableHeadCell>
                    <TableHeadCell $width="15%"></TableHeadCell>
                  </TableHeadRow>
                  </thead>
                  <tbody>
                  {loading ? (
                      <EmptyRow>
                        <td colSpan={5}>로딩 중...</td>
                      </EmptyRow>
                  ) : filteredItems.length > 0 ? (
                      filteredItems.map((item) => {
                        const status = item.status as
                            | "OVERDUE"
                            | "DUE_SOON"
                            | "NORMAL";

                        // 상태별 텍스트 생성
                        const getStatusText = () => {
                          switch (status) {
                            case "OVERDUE":
                              return ` (${Math.abs(item.daysRemaining || 0)}일 연체)`;
                            case "DUE_SOON":
                              return ` (${item.daysRemaining}일 남음)`;
                            case "NORMAL":
                              return ` (${item.daysRemaining}일 남음)`;
                            default:
                              return "";
                          }
                        };

                        return (
                            <TableBodyRow key={item.id}>
                              <TableBodyCellName>{item.itemName}</TableBodyCellName>
                              <TableBodyCell>{item.quantity}개</TableBodyCell>
                              <TableBodyCell>
                                {formatDate(item.rentedAt)}
                              </TableBodyCell>
                              <TableBodyCell>
                                <StatusPill $status={status}>
                                  {formatDate(item.dueAt)}
                                  {getStatusText()}
                                </StatusPill>
                              </TableBodyCell>
                              <TableBodyCellRight>
                                <ReturnButton
                                    onClick={() => handleReturnClick(item)}
                                >
                                  반납
                                </ReturnButton>
                              </TableBodyCellRight>
                            </TableBodyRow>
                        );
                      })
                  ) : (
                      <EmptyRow>
                        <td colSpan={5}>
                          {searchInput
                              ? `'${searchInput}'에 대한 검색 결과가 없습니다.`
                              : "대여중인 물품이 없습니다."}
                        </td>
                      </EmptyRow>
                  )}
                  </tbody>
                </Table>
              </TableContainer>
            </Card>
          </MainContainer>
        </ContentArea>

        {/* 반납 확인 모달 */}
        {isModalOpen && selectedItem && (
            <ModalOverlay onClick={handleCloseModal}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>물품 반납</ModalHeader>
                <ModalContent>
                  <p>
                    <strong>{selectedItem.itemName}</strong>을(를){" "}
                    <strong>{selectedItem.quantity}개</strong> 반납하시겠습니까?
                  </p>
                </ModalContent>
                <ModalFooter>
                  <ModalButton $variant="secondary" onClick={handleCloseModal}>
                    취소
                  </ModalButton>
                  <ModalButton $variant="primary" onClick={handleConfirmReturn}>
                    확인
                  </ModalButton>
                </ModalFooter>
              </ModalContainer>
            </ModalOverlay>
        )}
      </PageLayout>
  );
}
