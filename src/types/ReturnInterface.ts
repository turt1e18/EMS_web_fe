export type RentalStatus = 'OVERDUE' | 'DUE_SOON' | 'NORMAL';

export interface RentedListType {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  rentedAt: Date;
  dueAt: Date;
  daysRemaining: number;
  status: RentalStatus;
}

/**
 * 대여 목록의 3가지 상태별 타입
 * overdue: 연체
 * dueSoon: 곧 만기(7일 이내)
 * normal: 만기일까지 여유(7일 이상)
 */
export interface GroupedRentedListResponse {
  overdue: RentedListType[];
  dueSoon: RentedListType[];
  normal: RentedListType[];
}
