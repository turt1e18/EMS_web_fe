import styled, {css} from "styled-components";

export const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({theme}) => theme.colors?.background || "#f0f2f5"};
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(240, 240, 240, 0.27);
`;

export const MainContainer = styled.main`
  flex: 1;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card = styled.section`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  flex: 1;
  min-width: 220px;
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 44px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 14px;
  color: #000;
  outline: none;

  &:focus {
    border-color: #007aff;
    box-shadow: 0 0 0 1px rgba(0, 122, 255, 0.2);
  }
`;

export const SearchIconButton = styled.button`
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s ease;

  &:hover {
    color: #007aff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const CategorySelectWrapper = styled.div`
  width: 220px;
  position: relative;
`;

export const CategorySelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 14px;
  color: #000;
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: #007aff;
    box-shadow: 0 0 0 1px rgba(0, 122, 255, 0.2);
  }

  background-image: linear-gradient(45deg, transparent 50%, #64748b 50%),
  linear-gradient(135deg, #64748b 50%, transparent 50%);
  background-position: calc(100% - 16px) 16px,
  calc(100% - 12px) 16px;
  background-size: 5px 5px,
  5px 5px;
  background-repeat: no-repeat;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
  font-size: 16px;
  table-layout: fixed;
`;

export const TableHeadRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
`;

export const TableHeadCell = styled.th<{ $width?: string }>`
  padding: 16px 24px;
  text-align: center;
  font-weight: 500;
  color: #64748b;
  white-space: nowrap;
  width: ${({$width}) => $width || "auto"};
`;

export const TableHeadCellName = styled(TableHeadCell)`
  text-align: left;
`;

export const TableBodyRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableBodyCell = styled.td`
  padding: 16px 24px;
  text-align: center;
  color: #0f172a;
`;

export const TableBodyCellName = styled(TableBodyCell)`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

export const TableBodyCellRight = styled(TableBodyCell)`
  text-align: right;
`;

export const StatusPill = styled.span<{
  $status: "OVERDUE" | "DUE_SOON" | "NORMAL";
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;

  ${({$status}) => {
    switch ($status) {
      case "OVERDUE":
        return css`
          background: #fee2e2;
          color: #ef4444;
        `;
      case "DUE_SOON":
        return css`
          background: #fef9c3;
          color: #854d0e;
        `;
      case "NORMAL":
      default:
        return css`
          background: #f1f5f9;
          color: #64748b;
        `;
    }
  }};
`;

export const ReturnButton = styled.button`
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: #007aff;
  color: #ffffff;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #0369a1;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const EmptyRow = styled.tr`
  td {
    padding: 48px 24px;
    text-align: center;
    color: #64748b;
    font-weight: 500;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
`;

export const ModalContent = styled.div`
  margin-bottom: 24px;
  color: #475569;
  font-size: 1rem;
  line-height: 1.5;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const ModalButton = styled.button<{
  $variant?: "primary" | "secondary";
}>`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  border: none;

  ${({$variant}) =>
      $variant === "secondary"
          ? css`
            background: #f1f5f9;
            color: #64748b;

            &:hover {
              background: #e2e8f0;
              color: #475569;
            }
          `
          : css`
            background: #3b82f6;
            color: white;

            &:hover {
              background: #2563eb;
            }
          `}
`;
