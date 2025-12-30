import styled from "styled-components";

/**
 * LoginCard.tsx -------------------------------------------------------------------------------------
 */

export const PageCenter = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  color: ${({theme}) => theme.colors.text};
  background: ${({theme}) => theme.colors.background};
`;

export const Card = styled.section`
  width: 450px;
  max-width: calc(100vw - 48px);
  padding: 30px 31px;

  background: ${({theme}) => theme.colors.card};
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.radii.large};
  box-shadow: ${({theme}) => theme.shadow};
`;

export const Title = styled.h2`
  margin: 6px 0 19px;
  font-size: 1.6rem;
  font-weight: 850;
  line-height: 1.25;
  color: inherit;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const HelperRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const LinkA = styled.a`
  font-size: 0.93rem;
  font-weight: 600;
  text-decoration: none;
  color: ${({theme}) => theme.colors.primary};

  &:hover {
    filter: brightness(1.3);
  }
`;

export const BottomNote = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 0.95rem;
  color: inherit;
`;
