import t from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MaterialButton from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAuth } from "@/hooks";
import { singularOrPlural } from "@/utils";

function FooterWithOrderAndButtons({ order, buttons }) {
  const { firstName } = useAuth();
  const navigate = useNavigate();

  if (!order) return null;

  const { name, slices, flavours, pizzaFlavours } = order;

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
    >
      <OrderContainer item>
        <Typography>
          <b>{firstName}, seu pedido é:</b>
        </Typography>

        <Typography>
          Pizza <b>{name.toUpperCase()}</b> {"- "}({slices}{" "}
          {singularOrPlural(slices, "fatia", "fatias")}, {flavours}{" "}
          {singularOrPlural(flavours, "sabor", "sabores")})
        </Typography>

        {pizzaFlavours?.length > 0 && (
          <Typography>
            {singularOrPlural(pizzaFlavours.length, "no sabor", "nos sabores")}{" "}
            <b>
              {pizzaFlavours
                .map(({ name }) => name)
                .reduce((acc, flavour, index, array) => {
                  if (index === 0) {
                    return flavour;
                  }

                  if (index === array.length - 1) {
                    return `${acc} e ${flavour}`;
                  }

                  return `${acc}, ${flavour}`;
                }, "")}
            </b>
          </Typography>
        )}
      </OrderContainer>
      <Box display="flex" gap={1}>
        {buttons.back && (
          <Button
            {...buttons.back}
            component="a"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          />
        )}
        {buttons.action && (
          <Button {...buttons.action} component={Link} color="primary" />
        )}
      </Box>
    </Grid>
  );
}

FooterWithOrderAndButtons.propTypes = {
  order: t.shape({
    name: t.string.isRequired,
    slices: t.number.isRequired,
    flavours: t.number.isRequired,
    pizzaFlavours: t.arrayOf(
      t.shape({
        id: t.string.isRequired,
        name: t.string.isRequired
      })
    ),
  }).isRequired,

  buttons: t.shape({
    back: t.shape({
      children: t.node.isRequired
    }),
    action: t.shape({
      to: t.string,
      pathname: t.string,
      state: t.object,
      children: t.node.isRequired
    }),
  }).isRequired
}

const OrderContainer = styled(Grid).attrs({ item: true })`
  flex-grow: 1;
`;

const Button = styled(MaterialButton).attrs({
  variant: "contained",
})``;

export default FooterWithOrderAndButtons;
