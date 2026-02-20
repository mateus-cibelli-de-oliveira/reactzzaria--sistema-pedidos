import t from "prop-types";
import styled from "styled-components";
import Container from '@mui/material/Container';

const Content = ({ children, ...props }) => (
  <Main {...props}>
    <Container>
      {children}
    </Container>
  </Main>
);

Content.propTypes = {
  children: t.node.isRequired
}

const Main = styled.main`
  padding-top: calc(64px + ${({ theme }) => theme.spacing(4)});
  padding-left: ${({ theme }) => theme.spacing(4)};
  padding-right: ${({ theme }) => theme.spacing(4)};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  flex: 1;

  @media (max-width: 600px) {
    padding-top: calc(56px + ${({ theme }) => theme.spacing(3)});
    padding-left: ${({ theme }) => theme.spacing(2)};
    padding-right: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(3)};
  }
`;

export default Content;
