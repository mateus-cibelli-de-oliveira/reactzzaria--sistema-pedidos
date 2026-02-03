import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Card as MaterialCard } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  H4,
  HeaderContent,
  PizzaName,
  PizzasGrid,
  Divider,
  CardLink,
  Content,
  Footer,
} from "@/ui";
import { useCollection } from "@/hooks";
import { singularOrPlural, toMoney } from "@/utils";
import { HOME, CHOOSE_PIZZA_QUANTITY } from "@/routes";

const ChoosePizzaFlavours = () => {
  const location = useLocation();
  const [checkboxes, setCheckboxes] = useState(() => ({}));
  const pizzasFlavours = useCollection("pizzasFlavours");

  if (!location.state) {
    return <Navigate to={HOME} replace />;
  }

  if(!pizzasFlavours) {
    return "Carregando sabores...";
  }

  if(pizzasFlavours.length === 0) {
    return "Não há dados."
  }

  const { flavours, sizeIndex } = location.state;

  const handleChangeCheckbox = (pizzaId) => (e) => {
    if (checkboxesChecked(checkboxes) === flavours && e.target.checked) {
      return;
    }

    setCheckboxes((checkboxes) => {
      return {
        ...checkboxes,
        [pizzaId]: e.target.checked,
      };
    });
  };

  return (
    <>
      <Content>
        <HeaderContent>
          <H4>
            Escolha até {flavours}{" "}
            {singularOrPlural(flavours, "sabor", "sabores")}:
          </H4>
        </HeaderContent>
        <PizzasGrid>
          {pizzasFlavours.map((pizza) => (
            <Grid item key={pizza.id} xs>
              <Card checked={!!checkboxes[pizza.id]}>
                <Label>
                  <Checkbox
                    checked={!!checkboxes[pizza.id]}
                    onChange={handleChangeCheckbox(pizza.id)}
                  />
                  <Img src={pizza.image} alt={pizza.name} />

                  <Divider />

                  <PizzaName>{pizza.name}</PizzaName>
                  <Typography variant="h5">
                    {toMoney(pizza.value?.[sizeIndex] ?? 0)}
                  </Typography>
                </Label>
              </Card>
            </Grid>
          ))}
        </PizzasGrid>
      </Content>
      <Footer
        order={location.state}
        buttons={{
          back: {
            children: "Mudar tamanho"
          },
          action: {
            to: CHOOSE_PIZZA_QUANTITY,
            state: {
              ...location.state,
              pizzaFlavours: getFlavoursNameAndId({
                checkboxes, pizzasFlavours
              })
            },
            children: "Quantas pizzas?",
            disabled: checkboxesChecked(checkboxes).length === 0
          }
        }}
      />
    </>
  );
}

function checkboxesChecked(checkboxes) {
  return Object.values(checkboxes).filter(Boolean).length;
}

function getFlavoursNameAndId({ checkboxes = {}, pizzasFlavours = [] }) {
  return pizzasFlavours
    .filter((pizza) => checkboxes[pizza.id])
    .map((pizza) => ({
      id: pizza.id,
      name: pizza.name,
    }));
}

const Card = styled(MaterialCard)`
  && {
    border: 2px solid transparent;
    border-color: ${({ theme, checked }) =>
      checked ? theme.palette.secondary.light : ""};
  }
`;

const Label = styled(CardLink).attrs({
  component: "label",
})``;

const Checkbox = styled.input.attrs({
  type: "checkbox",
})`
  display: none;
`;

const Img = styled.img`
  width: 200px;
`;

export default ChoosePizzaFlavours;
