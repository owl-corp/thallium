import styled from "styled-components";

const CardContainer = styled.div<{ $seamless?: boolean; }>`
  border: 3px solid ${({ theme }) => theme.borderColor};
  border-top: ${({ $seamless }) => $seamless ? "0" : ""};
  padding: 16px;
  position: relative;
  background-color: ${({ theme }) => theme.cardBackgroundColor};
  text-align: left;
  box-shadow: 10px 10px 0 ${({ theme }) => theme.cardShadow};

  margin-top: ${({ $seamless }) => $seamless ? "0px" : "30px"};
  overflow-wrap: break-word;
`;

const CardTitle = styled.div<{ $seamless?: boolean; }>`
  position: absolute;
  top: -16px;
  left: 16px;
  background-color: ${({ theme }) => theme.cardBackgroundColor};
  ${({ $seamless, theme }) => $seamless ? "" : `background: linear-gradient(0deg, ${theme.cardBackgroundColor} 0%, ${theme.cardBackgroundColor} 45%, ${theme.backgroundColor} 55%)`};
  padding: 0 8px;
  font-weight: bold;
  z-index: 1;
  font-size: 1.2em;
`;

interface CardProps {
  title: string;
  children: React.ReactNode;
  seamless?: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, seamless }: CardProps) => {
  return (
    <CardContainer $seamless={seamless}>
      <CardTitle $seamless={seamless}>{title}</CardTitle>
      {children}
    </CardContainer>
  );
};

export default Card;
