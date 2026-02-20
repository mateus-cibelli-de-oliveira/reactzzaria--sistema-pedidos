import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import { Content, H6 as StyleH6, OrderInfo } from "@/ui";
import { useOrder } from "@/hooks";
import { CHECKOUT_CONFIRMATION, HOME } from "@/routes";
import FooterCheckout from "./footer-checkout";
import { FormColumn, FormRow, FlexItem } from "./form-layout";
import FormAddress from "./form-address";
import PhoneField from "./phone-field";

function Checkout() {
  const { order, addAddress, addPhone } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    if (!order.pizzas || order.pizzas.length === 0) {
      navigate(HOME, { replace: true });
    }
  }, [order.pizzas, navigate]);

  return (
    <>
      <Content>
        <CheckoutContainer>
          <Grid container spacing={4} justifyContent="center">
            {/* COLUNA ESQUERDA */}
            <Grid item xs={12} md={6}>
              <ColumnWrapper>
                <H6>Qual endereço para entrega?</H6>

                <PaperContainer>
                  <FormAddress onUpdate={addAddress} />
                </PaperContainer>

                <H6 paddingTop={4}>Qual o seu telefone?</H6>

                <PaperContainer>
                  <FormColumn>
                    <FormRow>
                      <FlexItem grow={2}>
                        <PhoneField onUpdate={addPhone} />
                      </FlexItem>
                    </FormRow>
                  </FormColumn>
                </PaperContainer>
              </ColumnWrapper>
            </Grid>

            {/* COLUNA DIREITA */}
            <Grid item xs={12} md={6}>
              <ColumnWrapper>
                <H6>Informações do seu pedido:</H6>
                <PaperContainer>
                  <OrderInfo showOptions />
                </PaperContainer>
              </ColumnWrapper>
            </Grid>
          </Grid>
        </CheckoutContainer>
      </Content>

      <FooterCheckout>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={CHECKOUT_CONFIRMATION}
        >
          Confirmar pedido
        </Button>
      </FooterCheckout>
    </>
  );
}

/* ================= STYLES ================= */

const CheckoutContainer = styled.div`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.breakpoints.values.lg}px;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const H6 = styled(StyleH6)`
  && {
    text-align: left;
  }
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PaperContainer = styled(Paper)`
  && {
    padding: ${({ theme }) => theme.spacing(2)};
    flex: 1;
  }
  width: 544px;
`;

export default Checkout;
