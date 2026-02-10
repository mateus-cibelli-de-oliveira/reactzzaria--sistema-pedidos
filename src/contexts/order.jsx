import { createContext, useState } from "react";
import t from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/hooks";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbPedidos } from "@/services/firebase";

const OrderContext = createContext();

function OrderProvider({ children }) {
  const [pizzas, addPizza] = useState([]);
  const [orderInProgress, setOrderInProgress] = useState(false);
  const [address, addAddress] = useState("");
  const [phone, addPhone] = useState("");
  const { user } = useAuth();

  function addPizzaToOrder(pizza){
    if(orderInProgress) {
      return addPizza((pizzas) => pizzas.concat(newPizza(pizza)));
    }
    setOrderInProgress(true);
    addPizza([newPizza(pizza)]);
  }

  function newPizza(pizza) {
    return {
      ...pizza,
      id: uuidv4()
    }
  }

  function removePizzaFromOrder(id) {
    console.log("Removendo ID:", id);
    addPizza((pizzas) => pizzas.filter((p) => p.id !== id));
  }

  async function sendOrder() {
    try {
      const orderPayload = {
        userId: user.uid,
        createdAt: serverTimestamp()
      }
  
      if (address) {
        const { 
          address: street, number, district, complement, city, state, code 
        } = address;
  
        Object.assign(orderPayload, {
          ...(street && { address: street }),
          ...(number && { number }),
          ...(district && { district }),
          ...(complement && { complement }),
          ...(city && { city }),
          ...(state && { state }),
          ...(code && { cep: code })
        });
      }
  
      Object.assign(orderPayload, {
        status: "pending",
        pizzas: pizzas.map(pizza => ({
          size: pizza.size,
          flavours: pizza.pizzaFlavours,
          quantity: Number(pizza.quantity)
        }))
      });
  
      console.log("Payload do pedido:", orderPayload);
  
      await addDoc(collection(dbPedidos, "orders"), orderPayload);
  
      console.log("Pedido enviado com sucesso!");
    } catch (e) {
      console.log("Erro ao salvar pedido:", e);
    }
  
    setOrderInProgress(false);
  }

  return (
    <OrderContext.Provider value={{
      order: {
        pizzas,
        address,
        phone,
        orderInProgress
      },
      addPizzaToOrder,
      addAddress,
      addPhone,
      removePizzaFromOrder,
      sendOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

OrderProvider.propTypes = {
  children: t.node.isRequired
}

export { OrderProvider, OrderContext }
