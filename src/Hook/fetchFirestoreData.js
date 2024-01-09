import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";

  // Helper function to fetch doc from Firestore
  export const fetchFirestoreData = async (collectionName, docId = null) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };