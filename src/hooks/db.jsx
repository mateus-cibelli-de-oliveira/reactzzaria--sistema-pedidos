import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

function useCollection(collectionName) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(docs);
    };

    loadData();
  }, [collectionName]);

  return data;
}

export default useCollection;
