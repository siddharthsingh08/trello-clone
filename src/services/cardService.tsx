import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";

export const createCard = async (
  title: string,
  listId: string,
  boardId: string,
  userId: string,
) => {
  await addDoc(collection(db, "cards"), {
    title,
    listId,
    boardId,
    userId,
    order: Date.now(),
    tags: [],
    createdAt: serverTimestamp(),
  });
};

export const subscribeToCards = (
  listId: string,
  userId: string,
  callback: (cards: any[]) => void,
) => {
  const q = query(
    collection(db, "cards"),
    where("listId", "==", listId),
    where("userId", "==", userId),
  );

  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(cards);
  });
};

export const updateCard = async (cardId: string, title: string) => {
  await updateDoc(doc(db, "cards", cardId), {
    title,
  });
};

export const deleteCard = async (cardId: string) => {
  await deleteDoc(doc(db, "cards", cardId));
};

export const updateCardTags = async (cardId: string, tags: any[]) => {
  await updateDoc(doc(db, "cards", cardId), {
    tags,
  });
};
