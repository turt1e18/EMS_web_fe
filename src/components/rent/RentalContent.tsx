"use client";

import React, {useState, useCallback, useEffect, useRef} from "react";
import toast from "react-hot-toast";
import {rentItemAction, getItemsAction} from "@/api/rent/rent.Server";
import {
  Card,
  FilterRow,
  SearchWrapper,
  SearchInput,
  SearchIconButton,
  CategorySelectWrapper,
  CategorySelect,
  TableContainer,
  Table,
  TableHeadRow,
  TableHeadCellName,
  TableHeadCell,
  TableBodyRow,
  TableBodyCell,
  TableBodyCellName,
  TableBodyCellRight,
  StatusPill,
  RentButton,
  EmptyRow,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalContent,
  ModalInputWrapper,
  ModalInput,
  ModalInputLabel,
  ModalFooter,
  ModalButton
} from "@/style/RentStyle";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import type {RentableItem} from "@/types/RentInterface";

// 카테고리 옵션
const CATEGORY_OPTIONS = ["대형", "중형", "소형", "전자", "소모품"];

export default function RentalContent() {
  const [items, setItems] = useState<RentableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false); // 중복 불러오기 방지용 Ref
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [hasMore, setHasMore] = useState(false);

  // 모달 관련 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentableItem | null>(null);
  const [rentQuantity, setRentQuantity] = useState(1);
  const quantityInputRef = useRef<HTMLInputElement>(null);

  /**
   * 물품 리스트 조회시 최종적으로 호출되는 함수
   * 서버함수인 getItemsAction을 검색어와 카테고리로 조회하도록 호출
   * visibleCount를 offset으로 사용
   */
  const fetchItems = useCallback(
      async (keyword: string, category: string, offset: number) => {
        if (isLoadingRef.current) return; // 이미 로딩 중이면 불러오지않음

        isLoadingRef.current = true;
        setLoading(true);
        try {
          // 10 + 1개 요청 (다음 페이지 존재 여부 확인용)
          const limit = 11;
          const result = await getItemsAction(keyword, category, offset, limit);

          // 반환값이 11개면 목록이 더 있다는 뜻 -> hasMore = true
          setHasMore(result.length === limit);

          // 반환값에 상관없이 10개까지만 보여줌
          const newItems = result.slice(0, 10);

          // offset이 0이면 새로고침이므로 전체를 교체하고, 그렇지 않으면 이전 목록에 추가
          if (offset === 0) {
            setItems(newItems);
          } else {
            setItems((prev) => [...prev, ...newItems]);
          }
        } catch (error) {
          console.error("물품 조회 실패:", error);
        } finally {
          setLoading(false);
          isLoadingRef.current = false;
        }
      },
      []
  );

  /**
   * 초기 로딩 시 물품 목록 조회
   */
  useEffect(() => {
    fetchItems("", "ALL", 0);
  }, [fetchItems]);

  /**
   *  현재 보이는 물품의 목록
   */

  // 더 불러올 목록이 있으면 true

  /**
   * 대여 모달 열기
   */
  const handleRentClick = (item: RentableItem) => {
    setSelectedItem(item);
    setRentQuantity(1);
    setIsModalOpen(true);
  };

  /**
   * 대여 모달 닫기
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setRentQuantity(1);
  };

  /**
   * 대여 수량 변경 핸들러
   */
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (Number.isNaN(val) || val < 1) {
      setRentQuantity(1);
      return;
    }

    if (selectedItem) {
      // 1회 대여 가능 최대 수량과 현재 재고 중 작은 값이 최대값
      const maxRentable = Math.min(
          selectedItem.maxQuantityPerRent,
          selectedItem.currentQuantity
      );

      if (val > maxRentable) {
        setRentQuantity(maxRentable);
        toast.error(`최대 ${maxRentable}개까지 대여 가능합니다.`);
      } else {
        setRentQuantity(val);
      }
    }
  };

  /**
   * 최종 대여 확정
   */
  const handleConfirmRent = useCallback(async () => {
    if (!selectedItem) return;

    try {
      await rentItemAction(selectedItem.id, rentQuantity);
      toast.success("대여 성공");
      handleCloseModal();
      // 목록 갱신을 위해 현재 검색 조건으로 다시 조회
      fetchItems(searchInput, selectedCategory, 0);
    } catch {
      toast.error("대여 실패");
    }
  }, [selectedItem, rentQuantity, searchInput, selectedCategory, fetchItems]);

  /**
   * 검색 실행
   * state로 들고있는 검색어와 카테고리 둘 다 포함해서 fetchItems 호출
   */
  const handleSearch = useCallback(() => {
    fetchItems(searchInput, selectedCategory, 0);
  }, [searchInput, selectedCategory, fetchItems]);

  /**
   * 엔터키 입력하면 handleSearch 호출
   */
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * 카테고리 선택 핸들러
   */
  const handleCategoryChange: React.ChangeEventHandler<HTMLSelectElement> = (
      e
  ) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    fetchItems(searchInput, newCategory, 0);
  };

  /**
   * 무한스크롤 Ref
   */
  const loadMoreRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasMore && !loading) {
        fetchItems(searchInput, selectedCategory, items.length);
      }
    },
    isLoading: loading
  });

  /**
   * 모달이 열렸을 때 수량 입력 박스에 포커스
   */
  useEffect(() => {
    if (isModalOpen && quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  }, [isModalOpen]);

  /**
   * 모달이 열렸을 때 Enter로 대여 실행 / Esc로 모달 닫기
   */
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleConfirmRent();
      } else if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleConfirmRent]);

  return (
      <Card>
        <FilterRow>
          <SearchWrapper>
            <SearchInput
                type="text"
                placeholder="물품 이름을 입력하세요"
                aria-label="물품 이름 검색"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <SearchIconButton
                onClick={handleSearch}
                disabled={loading}
                aria-label="검색"
            >
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

          <CategorySelectWrapper>
            <CategorySelect
                value={selectedCategory}
                onChange={handleCategoryChange}
                aria-label="카테고리 선택"
            >
              <option value="ALL">전체 카테고리</option>
              {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
              ))}
            </CategorySelect>
          </CategorySelectWrapper>
        </FilterRow>

        <TableContainer>
          <Table>
            <thead>
            <TableHeadRow>
              <TableHeadCellName $width="40%">물품 이름</TableHeadCellName>
              <TableHeadCell $width="15%">재고 현황</TableHeadCell>
              <TableHeadCell $width="15%">상태</TableHeadCell>
              <TableHeadCell $width="15%">대여가능개수</TableHeadCell>
              <TableHeadCell $width="15%"></TableHeadCell>
            </TableHeadRow>
            </thead>
            <tbody>
            {items.map((item) => {
              const isRentable = item.isRentable && item.currentQuantity > 0;

              return (
                  <TableBodyRow key={item.id}>
                    <TableBodyCellName>{item.name}</TableBodyCellName>
                    <TableBodyCell>
                      {item.currentQuantity} / {item.totalQuantity}
                    </TableBodyCell>
                    <TableBodyCell>
                      <StatusPill $status={isRentable}>
                        {isRentable ? "대여 가능" : "대여 불가"}
                      </StatusPill>
                    </TableBodyCell>
                    <TableBodyCell>{item.maxQuantityPerRent}개</TableBodyCell>
                    <TableBodyCellRight>
                      <RentButton
                          disabled={!isRentable}
                          onClick={() => handleRentClick(item)}
                          aria-disabled={!isRentable}
                      >
                        {"대여"}
                      </RentButton>
                    </TableBodyCellRight>
                  </TableBodyRow>
              );
            })}

            {items.length === 0 && (
                <EmptyRow>
                  <td colSpan={5}>
                    {searchInput
                        ? `'${searchInput}'에 대한 검색 결과가 없습니다.`
                        : "등록된 물품이 없습니다."}
                  </td>
                </EmptyRow>
            )}
            </tbody>
          </Table>
        </TableContainer>

        {items.length > 0 && hasMore && (
            <div ref={loadMoreRef} style={{height: "10px"}}/>
        )}

        {isModalOpen && selectedItem && (
            <ModalOverlay onClick={handleCloseModal}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>물품 대여</ModalHeader>
                <ModalContent>
                  <p>
                    <strong>{selectedItem.name}</strong>을(를) {rentQuantity}개
                    대여하시겠습니까?
                  </p>
                  <ModalInputWrapper>
                    <ModalInputLabel>대여 수량:</ModalInputLabel>
                    <ModalInput
                        ref={quantityInputRef}
                        type="number"
                        min={1}
                        max={Math.min(
                            selectedItem.maxQuantityPerRent,
                            selectedItem.currentQuantity
                        )}
                        value={rentQuantity}
                        onChange={handleQuantityChange}
                    />
                    <ModalInputLabel>개</ModalInputLabel>
                  </ModalInputWrapper>
                </ModalContent>
                <ModalFooter>
                  <ModalButton $variant="secondary" onClick={handleCloseModal}>
                    취소
                  </ModalButton>
                  <ModalButton $variant="primary" onClick={handleConfirmRent}>
                    확인
                  </ModalButton>
                </ModalFooter>
              </ModalContainer>
            </ModalOverlay>
        )}
      </Card>
  );
}
