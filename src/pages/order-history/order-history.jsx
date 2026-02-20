import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Content, H4 } from "@/ui";
import { useCollection, useOrder } from "@/hooks";
import useOrderHistory from "@/hooks/order-history";
import singularOrPlural from "@/utils/singular-or-plural";
import { CHECKOUT_CONFIRMATION } from "@/routes";

function OrderHistory() {
  const [filter, setFilter] = useState("30d");
  const { orders, loading, error } = useOrderHistory(filter);
  const pizzasSizes = useCollection("pizzasSizes");
  const pizzasFlavours = useCollection("pizzasFlavours");
  const {
    addAddress,
    addPhone,
    addPizzaToOrder,
    clearCurrentOrder
  } = useOrder();
  const navigate = useNavigate();

  function formatDate(createdAt) {
    if (!createdAt) return "Data não disponível";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleDateString("pt-BR");
  }

  function formatTime(createdAt) {
    if (!createdAt) return "";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getPizzaSizeName(sizeCm) {
    if (!pizzasSizes) return "Carregando...";
    const sizeFound = pizzasSizes.find((s) => Number(s.size) === Number(sizeCm));
    return sizeFound?.name || "Tamanho não encontrado";
  }

  function handleOrderAgain(orderAgain) {
    clearCurrentOrder();

    // endereço
    if (orderAgain.address) {
      addAddress({
        address: orderAgain.address.address,
        number: orderAgain.address.number,
        district: orderAgain.address.district,
        complement: orderAgain.address.complement,
        city: orderAgain.address.city,
        state: orderAgain.address.state,
        code: orderAgain.address.code
      });
    }

    // telefone
    if (orderAgain.phone) {
      addPhone(orderAgain.phone);
    }

    // pizzas
    if (orderAgain.pizzas?.length && pizzasFlavours) {
      const rebuiltPizzas = orderAgain.pizzas.map((pizza) => {
        const sizeFound = pizzasSizes?.find(
          (s) => Number(s.size) === Number(pizza.size)
        );

        const slicesFromSize = sizeFound?.slices || 0;

        const pizzaFlavoursWithNames = (pizza.flavours || []).map((f) => {
          const flavourFromCollection = pizzasFlavours.find(
            (pf) => pf.id === f.id
          );
          return {
            id: f.id,
            name: flavourFromCollection?.name || "Sabor desconhecido"
          }
        });

        return {
          name: sizeFound?.name || "",
          size: pizza.size,
          slices: slicesFromSize,
          quantity: pizza.quantity,
          pizzaFlavours: pizzaFlavoursWithNames,
          flavours: pizzaFlavoursWithNames.length
        };
      });

      rebuiltPizzas.forEach((pizza) => {
        addPizzaToOrder(pizza);
      });
    }

    navigate(CHECKOUT_CONFIRMATION, { state: { orderAgain: true } });
  }

  // Bloquear a renderização até todas as coleções carregarem!
  if (loading || !pizzasSizes || !pizzasFlavours) {
    return <Typography>Carregando histórico...</Typography>;
  }

  return (
    <Content>
      <H4>Histórico de pedidos</H4>

      <Box sx={{ mb: 2, width: 200 }}>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} fullWidth>
          <MenuItem value="30d">Últimos 30 dias</MenuItem>
          <MenuItem value="3m">Últimos 3 meses</MenuItem>
          <MenuItem value="6m">Últimos 6 meses</MenuItem>
        </Select>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {!error && orders.length === 0 && (
        <Typography>Você ainda não tem pedidos no histórico.</Typography>
      )}

      {!error && orders.length > 0 && (
        <Typography>
          Você tem {orders.length}{" "}
          {singularOrPlural(orders.length, "pedido", "pedidos")}.
        </Typography>
      )}

      <Stack spacing={2} sx={{ mt: 2 }}>
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent>
              <Typography variant="h6">
                Pedido feito em {formatDate(order.createdAt)} às{" "}
                {formatTime(order.createdAt)}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography>
                Status: <b>{order.status ?? "pending"}</b>
              </Typography>

              <Divider sx={{ my: 1 }} />

              {order.address && (
                <Typography>
                  Endereço:{" "}
                  <b>
                    {order.address.address}, {order.address.number} -{" "}
                    {order.address.city}/{order.address.state}
                  </b>
                </Typography>
              )}

              {order.phone && (
                <Typography>
                  Telefone: <b>{order.phone}</b>
                </Typography>
              )}

              <Divider sx={{ my: 1 }} />

              <Typography
                variant="subtitle1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocalPizzaIcon fontSize="small" />
                <b>Pizzas:</b>
              </Typography>

              {order.pizzas?.map((pizza, index) => {
                const slices =
                  pizzasSizes?.find(
                    (s) => Number(s.size) === Number(pizza.size)
                  )?.slices || 0;

                const flavoursWithNames = (pizza.flavours || []).map((f) => {
                  const flavourFromCollection = pizzasFlavours.find(
                    (pf) => pf.id === f.id
                  );
                  return flavourFromCollection?.name || "Sabor desconhecido";
                });

                return (
                  <div key={index}>
                    <Typography>
                      Tamanho: <b>{getPizzaSizeName(pizza.size)}</b> (
                      {slices}{" "}
                      {singularOrPlural(slices, "fatia", "fatias")},{" "}
                      {flavoursWithNames.length}{" "}
                      {singularOrPlural(
                        flavoursWithNames.length,
                        "sabor",
                        "sabores"
                      )}
                      )
                    </Typography>

                    <Typography>
                      Quantidade: <b>{pizza.quantity}</b>
                    </Typography>

                    {flavoursWithNames.length > 0 && (
                      <Typography>
                        Sabores:{" "}
                        <b>
                          {flavoursWithNames.reduce((acc, name, i, arr) => {
                            if (i === 0) return name;
                            if (i === arr.length - 1)
                              return `${acc} e ${name}`;
                            return `${acc}, ${name}`;
                          }, "")}
                        </b>
                      </Typography>
                    )}

                    <Divider sx={{ my: 1 }} />
                  </div>
                );
              })}

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOrderAgain(order)}
                >
                  Pedir novamente
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Content>
  );
}

export default OrderHistory;
