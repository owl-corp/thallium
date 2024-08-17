import styled from 'styled-components';


const CardContainer = styled.div`
  border: 3px solid ${({ theme }) => theme.borderColor};
  padding: 16px;
  position: relative;
  background-color: ${({ theme }) => theme.cardBackgroundColor};
  text-align: left;

  box-shadow: 10px 10px 0 ${({ theme }) => theme.cardShadow};
`;

const CardTitle = styled.div`
  position: absolute;
  top: -12px;
  left: 16px;
  background-color: ${({ theme }) => theme.cardBackgroundColor};
  background: linear-gradient(0deg, ${({ theme }) => theme.cardBackgroundColor} 0%, ${({ theme }) => theme.cardBackgroundColor} 45%, ${({ theme }) => theme.backgroundColor} 45%);
  padding: 0 8px;
  font-weight: bold;
  z-index: 1;
`;

interface CardProps {
    title: string;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
    return (
        <CardContainer>
            <CardTitle>{title}</CardTitle>
            {children}
        </CardContainer>
    );
};

export default Card;
