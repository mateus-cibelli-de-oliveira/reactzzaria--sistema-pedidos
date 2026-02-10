import styled from "styled-components";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  H3,
  H4,
  PizzaName,
  PizzasGrid,
  Divider,
  CardLink,
  Content
} from "@/ui";
import { useAuth, useCollection } from "@/hooks";
import { singularOrPlural } from "@/utils";

import { CHOOSE_PIZZA_FLAVOURS } from "@/routes";

const ChoosePizzaSize = () => {
  const { firstName } = useAuth();
  const pizzasSizes = useCollection("pizzasSizes");

  if (!pizzasSizes) {
    return (
      <CenteredWrapper>
        <Content>
          <NoData>Carregando tamanhos...</NoData>
        </Content>
      </CenteredWrapper>
    );
  }

  if (pizzasSizes.length === 0) {
    return (
      <CenteredWrapper>
        <Content>
          <NoData>Não há dados.</NoData>
        </Content>
      </CenteredWrapper>
    );
  }

  return (
    <Content>
      <Grid container direction="column" alignItems="center">
        <H3 noWrap>
          O que temos para hoje {firstName}? :)
        </H3>

        <H4>
          Escolha o tamanho da pizza:
        </H4>
      </Grid>

      <PizzasGrid>
        {pizzasSizes.map((pizza, index) => (
          <Grid item key={pizza.id} xs>
            <Card>
              <CardLink
                to={CHOOSE_PIZZA_FLAVOURS}
                state={{
                  ...pizza,
                  sizeIndex: index
                }}
              >
                <Pizza>
                  <PizzaText>{pizza.size}cm</PizzaText>
                </Pizza>

                <Divider />

                <PizzaName>{pizza.name}</PizzaName>
                <Typography>
                  {pizza.slices} fatias, {pizza.flavours}{" "}
                  {singularOrPlural(pizza.flavours, "sabor", "sabores")}
                </Typography>
              </CardLink>
            </Card>
          </Grid>
        ))}
      </PizzasGrid>
    </Content>
  );
}

const Pizza = styled.div`
  height: 200px;
  width: 200px;
  border: 1px solid ${({ theme }) => theme.palette.grey[300]};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: ${({ theme }) => theme.palette.common.white};
  z-index: 1;

  &::before,
  &::after {
    background: ${({ theme }) => theme.palette.grey[300]};
    content: "";
    position: absolute;
    transform: rotate(45deg);
  }

  &::before {
    height: 1px;
    width: 160px;
  }

  &::after {
    height: 160px;
    width: 1px;
  }
`;

const PizzaText = styled(Typography).attrs({
  variant: "h5",
})`
  && {
    height: 80px;
    width: 80px;
    border-radius: 50px;
    background: ${({ theme }) => theme.palette.common.white};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
  }
`;

const CenteredWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoData = styled(Typography).attrs({
  variant: "h6",
})`
  && {
    margin-top: 40px;
    text-align: center;
    font-weight: bold;
    color: ${({ theme }) => theme.palette.grey[600]};
  }
`;

export default ChoosePizzaSize;
