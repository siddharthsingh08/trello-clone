import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createList, subscribeToLists } from "../services/listService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import ListColumn from "../components/ListColumn";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { updateBoard } from "../services/boardService";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { createCard } from "../services/cardService";
import { DragOverlay } from "@dnd-kit/core";
import { useAuth } from "../context/AuthContext";

export default function BoardDetails() {
  const { id } = useParams();
  const [lists, setLists] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [cards, setCards] = useState<any[]>([]);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [activeCard, setActiveCard] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;

      const docRef = doc(db, "boards", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) setBoardTitle(docSnap.data().title);
    };
    fetchBoard();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (!user) return;

    const unsubscribe = subscribeToLists(id, user.uid, setLists);
    return () => unsubscribe();
  }, [id, user]);

  useEffect(() => {
    if (!id) return;
    if (!user) return;

    const q = query(
      collection(db, "cards"),
      where("boardId", "==", id),
      where("userId", "==", user.uid),
      orderBy("order"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(data);
    });

    return () => unsubscribe();
  }, [id, user]);

  const handleAddCard = async (title: string, listId: string) => {
    if (!id) return;
    if (!user) return;
    await createCard(title, listId, id, user.uid);
  };

  const handleCreateList = async () => {
    if (!title.trim() || !id) return;
    if (!user) return;
    await createList(title, id, user.uid);
    setTitle("");
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeCard = cards.find((c) => c.id === active.id);
    if (!activeCard) return;

    // CASE 1: dropped on another card
    const overCard = cards.find((c) => c.id === over.id);

    let newListId;

    if (overCard) {
      newListId = overCard.listId;
    } else {
      // CASE 2: dropped on empty list
      newListId = over.id;
    }

    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);

    const updatedCards = [...cards];
    updatedCards.splice(oldIndex, 1);

    const movedCard = {
      ...activeCard,
      listId: newListId,
    };

    if (newIndex >= 0) {
      updatedCards.splice(newIndex, 0, movedCard);
    } else {
      updatedCards.push(movedCard);
    }

    setCards(updatedCards);

    try {
      await Promise.all(
        updatedCards.map((card, index) =>
          updateDoc(doc(db, "cards", card.id), {
            order: index,
            listId: card.listId,
          }),
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleBoardUpdate = async () => {
    if (!boardTitle.trim() || !id) return;
    await updateBoard(id, boardTitle);
    setIsEditingBoard(false);
  };

  return (
    <div className="min-h-screen bg-[#355872] text-[#F7F8F0] p-6">
      {isEditingBoard ? (
        <input
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          onBlur={handleBoardUpdate}
          onKeyDown={(e) => e.key === "Enter" && handleBoardUpdate()}
          className="text-3xl font-bold bg-gray-800 px-3 py-1 rounded mb-6"
          autoFocus
        />
      ) : (
        <h1
          className="text-3xl font-bold mb-6 cursor-pointer"
          onDoubleClick={() => setIsEditingBoard(true)}>
          {boardTitle}
        </h1>
      )}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="New List..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 rounded-lg text-[#9CD5FF] border border-white"
        />
        <button
          onClick={handleCreateList}
          className="bg-blue-500 px-4 py-2 rounded cursor-pointer">
          Add List
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          const card = cards.find((c) => c.id === event.active.id);
          setActiveCard(card);
        }}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setActiveCard(null);
        }}>
        <div className="flex gap-4 overflow-x-auto">
          {lists.map((list) => (
            <ListColumn
              key={list.id}
              list={list}
              cards={cards.filter((c) => c.listId === list.id)}
              onAddCard={handleAddCard}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className="bg-gray-700 p-2 rounded shadow-xl">
              {activeCard.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
