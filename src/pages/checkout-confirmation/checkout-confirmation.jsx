import { Link } from "react-router-dom";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Content, H4, H6, OrderInfo, Divider } from "@/ui";
import { useAuth, useOrder } from "@/hooks";
import { CHECKOUT_SUCCESS } from "@/routes";
import FooterCheckout from "@/pages/checkout/footer-checkout";

const isAddressComplete = (address) =>
  !!address?.address &&
  !!address?.number &&
  !!address?.district &&
  !!address?.city &&
  !!address?.state &&
  !!address?.code;

function CheckoutConfirmation() {
  const { firstName } = useAuth();
  const { order, sendOrder } = useOrder();
  const canProceedCheckout = isAddressComplete(order.address) && !!order.phone;

  return (
    <>
      <Content>
        <Header>
          <H4>Oi {firstName}!</H4>
          <Typography>
            Confere, por favor, se está tudo certo com o seu pedido antes de
            finalizar?
          </Typography>
        </Header>
        <Container maxWidth="sm">
          <PaperContainer>
            <H6>Seu pedido:</H6>
            <OrderInfo />

            <Divider />

            <H6>Endereço para entrega:</H6>
            {!isAddressComplete(order.address) ? (
              <Typography variant="body2" color="text.secondary">
                Endereço não informado!
              </Typography>
            ) : (
              <Typography>
                {order.address.address},
                {" nº"} {order.address.number},
                {" "} {order.address.complement}
                <br />
                Bairro: {order.address.district}
                <br />
                CEP: {order.address.code}
                <br />
                {order.address.city}/{order.address.state}
              </Typography>
            )}

            <Divider />

            <H6>Telefone para contato:</H6>
            {!order.phone ? (
              <Typography variant="body2" color="text.secondary">
                Telefone não informado!
              </Typography>
            ) : (
              <Typography>{order.phone}</Typography>
            )}
          </PaperContainer>
        </Container>
      </Content>

      <FooterCheckout justifyContent="center">
        {console.log("ADDRESS NO BOTAO:", order.address)}
        {console.log("IS COMPLETE:", isAddressComplete(order.address))}
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to={CHECKOUT_SUCCESS}
          onClick={sendOrder}
          disabled={!canProceedCheckout}
        >
          Tudo certo!
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

export default CheckoutConfirmation;
