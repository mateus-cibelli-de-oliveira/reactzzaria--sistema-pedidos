import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { dbPedidos } from "@/services/firebase";

function useCollection(collectionName) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const querySnapshot = await getDocs(
        collection(dbPedidos, collectionName)
      );
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(docs);
    }

    loadData();
  }, [collectionName]);

  return data;
}

export default useCollection;
