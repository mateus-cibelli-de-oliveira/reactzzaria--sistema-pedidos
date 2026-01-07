import { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import styled from "styled-components";
import MaterialInput from "@mui/material/Input";
import Button from "@mui/material/Button";
import { Content, HeaderContent, H4, Footer } from "@/ui";
import { useOrder } from "@/hooks";
import { HOME, CHECKOUT } from "@/routes";

function ChoosePizzaQuantity() {
  const [quantity, setQuantity] = useState(1);
  const { addPizzaToOrder } = useOrder();

  const location = useLocation();

  if (!location.state) {
    return <Navigate to={HOME} replace />;
  }

  console.log("location.state", location.state);

  function handleChange(e) {
    const { value } = e.target;

    if(value >= 1){
      setQuantity(value);
    }
  }

  function addPizza() {
    addPizzaToOrder({
      ...location.state,
      quantity
    });
  }

  return (
    <>
      <Content>
        <HeaderContent>
          <H4>
            Quantas pizzas você gostaria
            <br />
            de pedir, com esses sabores?
          </H4>
        </HeaderContent>

        <MainContent>
          <Input
            value={quantity}
            onChange={handleChange}
            autoFocus
          />
          <ButtonAddPizza to={HOME} onClick={addPizza}>
            Adicionar e<br />
            montar outra
          </ButtonAddPizza>
        </MainContent>
      </Content>

      <Footer
        order={location.state}
        buttons={{
          back: {
            children: "Mudar sabores"
          },
          action: {
            to: CHECKOUT,
            onClick: addPizza,
            children: "Finalizar compra"
          }
        }}
      />
    </>
  );
}

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const Input = styled(MaterialInput).attrs({
  type: "number",
})`
  && {
    margin-bottom: ${({ theme }) => theme.spacing(3)};
  }

  & input {
    font-size: 80px;
    padding: 10px;
    text-align: center;
    width: 150px;
  }
`;

const ButtonAddPizza = styled(Button).attrs({
  variant: "contained",
  color: "secondary",
  component: Link
})`
  && {
    text-align: center;
  }
`;

export default ChoosePizzaQuantity;
