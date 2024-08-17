import styled from 'styled-components';

import Card from '../components/Card';

const Header = styled.header`
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


const LandingPage = () => {
    return (
        <>
            <Header>
                <img src="icon.svg" alt="Thallium logo" />
                <h1>
                    Thallium
                </h1>
            </Header>
            <div>
                <Card title="Welcome to Thallium">
                    <p>
                        Thallium is a project being developed by Owl Corp.
                    </p>
                    <p>
                        Owl Corp team members can track development progress on the <a href="https://github.com/owl-corp/thallium">GitHub repository</a>.
                    </p>
                    <p>
                        LLAP. 🖖
                    </p>
                </Card>
            </div>
        </>
    );
};

export default LandingPage;
