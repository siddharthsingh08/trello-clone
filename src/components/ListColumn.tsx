import { useState } from "react";
import CardItem from "./CardItem";
import { useDroppable } from "@dnd-kit/core";
import { updateList, deleteList } from "../services/listService";

export default function ListColumn({
  list,
  cards,
  onAddCard,
}: {
  list: any;
  cards: any[];
  onAddCard: (title: string, listId: string) => void;
}) {
  const [title, setTitle] = useState("");

  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;
    await updateList(list.id, editTitle);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-800 p-4 rounded-lg min-w-[250px] min-h-[120px]">
      <div className="flex justify-between mb-4">
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            className="bg-gray-700 px-2 py-1 rounded text-white w-full mr-2"
            autoFocus
          />
        ) : (
          <h2
            onDoubleClick={() => setIsEditing(true)}
            className="text-xl font-semibold cursor-pointer">
            {list.title}
          </h2>
        )}

        <button
          onClick={() => deleteList(list.id)}
          className="text-red-400 text-sm cursor-pointer">
          Delete
        </button>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      <input
        type="text"
        placeholder="New Card..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-2 py-1 rounded text-gray mb-2 mr-3"
      />

      <button
        onClick={() => {
          if (!title.trim()) return;
          onAddCard(title, list.id);
          setTitle("");
        }}
        className="bg-blue-500 px-3 py-1 rounded cursor-pointer">
        Add Card
      </button>
    </div>
  );
}
