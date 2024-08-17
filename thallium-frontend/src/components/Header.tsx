import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;

  img {
    width: 64px;
    height: 64px;
  }

  h1 {
    margin: 0;
    margin-left: 1rem;
  }
`;


const Header = () => {
    return (
        <HeaderContainer>
            <img src="icon.svg" alt="Thallium logo" />
            <h1>
                Thallium
            </h1>
        </HeaderContainer>
    );
};

export default Header;
