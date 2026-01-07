import t from "prop-types";
import styled from "styled-components";
import Container from "@mui/material/Container";
import FooterWithOrderAndButtons from "./footer-with-order-and-buttons";

const Footer = ({ children, ...props }) => (
  <FooterContent>
    <ContainerStyled>
      {children || <FooterWithOrderAndButtons {...props} />}
    </ContainerStyled>
  </FooterContent>
);

Footer.propTypes = {
  children: t.node
}

const FooterContent = styled.footer`
  box-shadow: 0 -1px 4px ${({ theme }) => theme.palette.grey[400]};
`;

const ContainerStyled = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

export default Footer;
