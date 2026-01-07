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
  padding-top: calc(64px + 20px); /* topo */
  padding-left: 20px; /* lateral esquerda */
  padding-right: 20px; /* lateral direita */
  padding-bottom: 20px; /* parte de baixo */
  flex: 1; /* ocupa o espaço restante */

  @media (max-width: 600px) {
    padding-top: calc(56px + 20px);
  }
`;

export default Content;
