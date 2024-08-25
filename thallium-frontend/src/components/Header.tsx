import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  margin-top: 2rem;

  img {
    width: 64px;
    height: 64px;
  }

  h1 {
    margin: 0;
    margin-left: 1rem;
  }
`;

const NoStyleLink = styled.a`
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      {/* FIXME: Try get this to use React router somehow for SPA routing */}
      <NoStyleLink className="Header-bar" href="/">
        <img src="icon.svg" alt="Thallium logo" />
        <h1>
          Thallium
        </h1>
      </NoStyleLink>
    </HeaderContainer>
  );
};

export default Header;
