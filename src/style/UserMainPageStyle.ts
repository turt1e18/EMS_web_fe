import styled from "styled-components";
import Link from "next/link";
import type {
  RentalStatus,
  RentalListColors
} from "@/types/UserMainPageInterface";

/**
 * page.tsx -------------------------------------------------------------------------------------
 */
export const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({theme}) => theme.colors.background};
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(240, 240, 240, 0.27);
`;

export const MainContainer = styled.main`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: rgb(100, 116, 139);
  font-size: 1rem;
  text-align: center;

  .material-icons-outlined {
    font-size: 48px;
    margin-bottom: 16px;
    color: rgb(203, 213, 225);
  }
`;

export const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  border-radius: 12px;
  border: solid 1px rgb(236, 236, 243);
  background: rgb(241, 245, 249);
  color: rgb(51, 65, 85);
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.15s ease,
  color 0.15s ease;

  &:hover {
    background: rgb(226, 232, 240);
  }
`;

/**
 * Header.tsx -------------------------------------------------------------------------------------
 */
export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const IconButton = styled.button`
  padding: 8px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${({theme}) => theme.colors.subText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .material-icons-outlined {
    font-size: 20px;
  }
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.subText};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px; /* 아이콘/이니셜 크기 */
`;

/**
 * RentalList.tsx -------------------------------------------------------------------------------------
 */

export const RentalListTheme: Record<RentalStatus, RentalListColors> = {
  overdue: {
    bg: "rgba(244,63,94,.06)",
    border: "rgb(252,165,165)",
    heading: "rgb(190,18,60)",
    due: "rgb(225,29,72)"
  },
  dueSoon: {
    bg: "rgba(245,158,11,.08)",
    border: "rgb(253,186,116)",
    heading: "rgb(194,65,12)",
    due: "rgb(234,88,12)"
  },
  rented: {
    bg: "white",
    border: "rgb(226,232,240)",
    heading: "rgb(51,65,85)",
    due: "rgb(100,116,139)"
  }
};

export const CardLink = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

export const Section = styled.section<{ $c: RentalListColors }>`
  background: ${({$c}) => $c.bg};
  border: 1px solid ${({$c}) => $c.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 0.08s ease,
  box-shadow 0.08s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  }
`;

export const Header = styled.h3<{ $c: RentalListColors }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-weight: 600;
  font-size: 1.125rem;
  color: ${({$c}) => $c.heading};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 4px;
`;

export const ItemName = styled.span`
  color: rgb(51, 65, 85); /* slate-700 */
  font-weight: 500;
`;

export const Due = styled.span<{ $c: RentalListColors }>`
  color: ${({$c}) => $c.due};
  font-size: 0.875rem;
`;

/**
 * SideBar.tsx -------------------------------------------------------------------------------------
 */

export const SidebarContainer = styled.aside`
  width: 240px;
  flex-shrink: 0;
  background: ${({theme}) => theme.colors.card};
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  position: sticky;
  top: 0;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
`;

export const LogoIcon = styled.div`
  background: ${({theme}) => theme.colors.primary};
  padding: 8px;
  border-radius: ${({theme}) => theme.radii.small};
  display: flex;
  align-items: center;
  justify-content: center;

  .material-icons-outlined {
    font-size: 24px;
    color: white;
  }
`;

export const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({theme}) => theme.colors.text};
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${({theme}) => theme.radii.small};
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;

  ${({$active, theme}) =>
      $active
          ? `
    background: ${theme.colors.primary};
    color: white;
    box-shadow: ${theme.shadow};`
          : `
    color: ${theme.colors.subText};
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  `}
  .material-icons-outlined {
    font-size: 20px;
  }
`;

export const LogoutButton = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: rgb(255, 255, 255);
  color: rgb(30, 41, 59);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgb(243, 243, 243);
  }
`;
