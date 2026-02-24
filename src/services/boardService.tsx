import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

export const updateBoard = async (boardId: string, title: string) => {
  await updateDoc(doc(db, "boards", boardId), {
    title,
  });
};

export const deleteBoard = async (boardId: string) => {
  await deleteDoc(doc(db, "boards", boardId));
};

export const createBoard = async (title: string, userId: string) => {
  await addDoc(collection(db, "boards"), {
    title,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToBoards = (
  userId: string,
  callback: (boards: any[]) => void,
) => {
  const q = query(collection(db, "boards"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const boards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(boards);
  });
};
