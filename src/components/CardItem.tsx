import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import {
  updateCard,
  deleteCard,
  updateCardTags,
} from "../services/cardService";

export default function CardItem({ card }: { card: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    });

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);

  // Tag state
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("bg-blue-500");

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;
    await updateCard(card.id, editTitle);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteCard(card.id);
  };

  const handleAddTag = async () => {
    if (!tagName.trim()) return;

    const updatedTags = [
      ...(card.tags || []),
      { name: tagName, color: tagColor },
    ];

    await updateCardTags(card.id, updatedTags);
    setTagName("");
    setShowTagInput(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-700 p-2 rounded flex flex-col gap-1">
      {/* DRAG HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-xs text-gray-400 mb-1">
        ⋮⋮ drag
      </div>

      {/* TAGS */}
      <div className="flex gap-1 flex-wrap">
        {card.tags?.map((tag: any, index: number) => (
          <span
            key={index}
            className={`${tag.color} text-xs px-2 py-0.5 rounded`}>
            {tag.name}
          </span>
        ))}
      </div>

      {/* TITLE / EDIT */}
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            className="bg-gray-600 px-2 py-1 rounded text-white w-full mr-2"
            autoFocus
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className="cursor-pointer">
            {card.title}
          </span>
        )}

        <button
          onClick={handleDelete}
          className="text-red-400 ml-2 cursor-pointer">
          X
        </button>
      </div>

      {/* ADD TAG BUTTON */}
      <button
        onClick={() => setShowTagInput(!showTagInput)}
        className="text-xs text-gray-300 mt-1 text-left cursor-pointer">
        + Tag
      </button>

      {/* TAG INPUT */}
      {showTagInput && (
        <div className="mt-1 flex flex-col gap-1">
          <input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Tag name"
            className="px-2 py-1 rounded text-[#9CD5FF] text-sm mb-2"
          />

          <select
            value={tagColor}
            onChange={(e) => setTagColor(e.target.value)}
            className="text-[#9CD5FF] text-sm px-2 py-1 rounded bg-black mb-3">
            <option value="bg-green-500">Green</option>
            <option value="bg-red-500">Red</option>
            <option value="bg-yellow-500">Yellow</option>
            <option value="bg-blue-500">Blue</option>
            <option value="bg-purple-500">Purple</option>
          </select>

          <button
            onClick={handleAddTag}
            className="bg-gray-600 text-xs py-1 rounded">
            Add Tag
          </button>
        </div>
      )}
    </div>
  );
}
