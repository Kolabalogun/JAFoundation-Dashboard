import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../utils/Firebase";

const useFirestoreCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loader, loaderF] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const dataList = [];
        snapshot.docs.forEach((doc) => {
          dataList.push({ id: doc.id, ...doc.data() });
        });
        setData(dataList);
        loaderF(false);
      },
      (error) => {
        console.log(error);
        loaderF(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [collectionName]);

  return { data, loader };
};

export default useFirestoreCollection;
