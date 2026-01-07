import t from "prop-types";
import styled from "styled-components";
import List from "@mui/material/List";
import MaterialListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";
import { useOrder } from "@/hooks";
import { singularOrPlural } from "@/utils";

function OrderInfo({ showOptions }) {
  const { order, removePizzaFromOrder } = useOrder();

  return (
    <List>
      {order.pizzas.map((pizza) => {
        const { name, slices, flavours, pizzaFlavours, quantity } = pizza;

        console.log("ID da pizza:", pizza.id);

        return (
          <ListItem key={pizza.id}>
            <Typography>
              <b>{quantity}</b> {singularOrPlural(quantity, "pizza", "pizzas")}{" "}
              <b>{name.toUpperCase()}</b> — ({slices}{" "}
              {singularOrPlural(slices, "fatia", "fatias")}, {flavours}{" "}
              {singularOrPlural(flavours, "sabor", "sabores")})
              <br />
              {singularOrPlural(
                pizzaFlavours.length,
                "no sabor",
                "nos sabores"
              )}{" "}
              <b>{pizzaFlavours.map(({ name }) => name).join(", ")}</b>
            </Typography>

            {showOptions && (
              <IconButton
                title="Remover"
                color="secondary"
                onClick={() => removePizzaFromOrder(pizza.id)}
              >
                <CloseIcon />
              </IconButton>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}

OrderInfo.propTypes = {
  showOptions: t.bool
}

const ListItem = styled(MaterialListItem)`
  && {
    display: flex;
    justify-content: space-between;
  }
`;

export default OrderInfo;
