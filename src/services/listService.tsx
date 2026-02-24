import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";

export const updateList = async (listId: string, title: string) => {
  await updateDoc(doc(db, "lists", listId), {
    title,
  });
};

export const deleteList = async (listId: string) => {
  await deleteDoc(doc(db, "lists", listId));
};

export const createList = async (
  title: string,
  boardId: string,
  userId: string,
) => {
  await addDoc(collection(db, "lists"), {
    title,
    boardId,
    order: Date.now(),
    userId,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToLists = (
  boardId: string,
  userId: string,
  callback: (lists: any[]) => void,
) => {
  const q = query(
    collection(db, "lists"),
    where("boardId", "==", boardId),
    where("userId", "==", userId),
    orderBy("order"),
  );

  return onSnapshot(q, (snapshot) => {
    const lists = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lists);
  });
};
