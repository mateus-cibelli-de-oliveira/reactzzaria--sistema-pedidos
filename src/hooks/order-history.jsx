import { useEffect, useState } from "react";
import { useAuth } from "@/hooks";
import { dbPedidos } from "@/services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

function useOrderHistory(filter = "30d") {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        if (!user?.uid) {
          setOrders([]);
          return;
        }

        const ordersQuery = query(
          collection(dbPedidos, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(ordersQuery);

        let docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        let dateLimit = null;
        if (filter.endsWith("d")) {
          const days = parseInt(filter.replace("d", ""), 10);
          dateLimit = new Date();
          dateLimit.setDate(dateLimit.getDate() - days);
        } else if (filter.endsWith("m")) {
          const months = parseInt(filter.replace("m", ""), 10);
          dateLimit = new Date();
          dateLimit.setMonth(dateLimit.getMonth() - months);
        }

        if (dateLimit) {
          docs = docs.filter((order) => {
            if (!order.createdAt) return false;
            const orderDate = order.createdAt.toDate
              ? order.createdAt.toDate()
              : new Date(order.createdAt);
            return orderDate >= dateLimit;
          });
        }

        setOrders(docs);
      } catch (e) {
        console.log(e);
        setError("Erro ao carregar histórico de pedidos.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, filter]);

  return { orders, loading, error };
}

export default useOrderHistory;
