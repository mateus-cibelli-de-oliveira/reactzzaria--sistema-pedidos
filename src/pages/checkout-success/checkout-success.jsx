import { Link } from "react-router-dom";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Content, H4, H6, OrderInfo, Divider } from "@/ui";
import { useAuth, useOrder } from "@/hooks";
import { HOME } from "@/routes";
import FooterCheckout from "@/pages/checkout/footer-checkout";

function CheckoutSuccess() {
  const { firstName } = useAuth();
  const { order } = useOrder();

  return (
    <>
      <Content>
        <Header>
          <H4>Prontinho {firstName}!</H4>
          <Typography>
            Seu pedido será entregue no endereço a baixo em até
          </Typography>

          <H6>40 minutos :)</H6>
        </Header>
        <Container maxWidth="sm">
          <PaperContainer>
            <H6>Seu pedido:</H6>
            <OrderInfo />

            <Divider />

            <H6>Endereço para entrega:</H6>
            <Typography>
              {order.address.address},
              {" nº"} {order.address.number},
              {""} {order.address.complement}<br />
              Bairro: {order.address.district}<br />
              CEP: {order.address.code}<br />
              {order.address.city}/{order.address.state}
            </Typography>

            <Divider />

            <H6>Telefone para contato:</H6>
            <Typography>{order.phone}</Typography>
          </PaperContainer>
        </Container>
      </Content>

      <FooterCheckout justifyContent="center">
        <Button
          color="secondary"
          size="large"
          component={Link}
          to={HOME}
        >
          {"<"} Voltar para a página inicial
        </Button>
      </FooterCheckout>
    </>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const PaperContainer = styled(Paper)`
  && {
    padding: ${({ theme }) => theme.spacing(3)};
  }
`;

export default CheckoutSuccess;
