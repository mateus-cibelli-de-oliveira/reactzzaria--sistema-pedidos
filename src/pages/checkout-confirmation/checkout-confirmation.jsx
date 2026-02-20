import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Content, H4, H6, OrderInfo, Divider } from "@/ui";
import { useAuth, useOrder } from "@/hooks";
import { CHECKOUT_SUCCESS, CHECKOUT, HOME } from "@/routes";
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
  const { order: currentOrder, sendOrder } = useOrder();
  const location = useLocation();
  const navigate = useNavigate();

  const orderToUse = currentOrder;

  const canProceedCheckout =
    orderToUse && isAddressComplete(orderToUse.address) && !!orderToUse.phone;

  const cameFromOrderHistory = location.state?.orderAgain === true;

  const pizzasLength = currentOrder?.pizzas?.length || 0;

  useEffect(() => {
    if (pizzasLength === 0) {
      navigate(HOME, { replace: true });
    }
  }, [pizzasLength, navigate]);

  function handleAlterAddress() {
    navigate(CHECKOUT, { state: { orderAgain: true } });
  }

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
            <OrderInfo order={orderToUse} />

            <Divider />

            <H6>Endereço para entrega:</H6>
            {!orderToUse || !isAddressComplete(orderToUse.address) ? (
              <Typography variant="body2" color="text.secondary">
                Endereço não informado!
              </Typography>
            ) : (
              <Typography>
                {orderToUse.address.address},
                {" nº"} {orderToUse.address.number}
                {" "} {orderToUse.address.complement}
                <br />
                Bairro: {orderToUse.address.district}
                <br />
                CEP: {orderToUse.address.code}
                <br />
                {orderToUse.address.city}/{orderToUse.address.state}
              </Typography>
            )}

            <Divider />

            <H6>Telefone para contato:</H6>
            {!orderToUse?.phone ? (
              <Typography variant="body2" color="text.secondary">
                Telefone não informado!
              </Typography>
            ) : (
              <Typography>{orderToUse.phone}</Typography>
            )}
          </PaperContainer>
        </Container>
      </Content>

      <FooterCheckout
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2
        }}
      >
        {cameFromOrderHistory && orderToUse?.pizzas?.length > 0 && (
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{ mr: 2 }}
            onClick={handleAlterAddress}
          >
            Alterar endereço
          </Button>
        )}

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
