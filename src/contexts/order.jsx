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
      console.log("Payload do pedido:", {
        userId: user?.uid,
        address,
        phone,
        pizzas
        });

      pizzas.forEach((pizza, index) => {
        console.log(`Pizza ${index}:`, pizza);
      });


      await addDoc(collection(dbPedidos, "orders"), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        address,
        phone,
        pizzas: pizzas.map(pizza => ({
          size: pizza.size,
          flavours: pizza.pizzaFlavours,
          quantity: pizza.quantity
        }))
      });
    } catch (e) {
      console.log("erro ao salvar pedido:", e);
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
