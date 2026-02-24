import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createBoard, deleteBoard, subscribeToBoards } from "../services/boardService";
import { useNavigate } from "react-router-dom";

export default function Boards() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {


    if (!user) return;

    const unsubscribe = subscribeToBoards(user.uid, setBoards);

    return () => unsubscribe();
  }, [user]);

  const handleCreateBoard = async () => {
    if (!title.trim() || !user) return;
    await createBoard(title, user.uid);
    setTitle("");
  };

  return (
    <div className="min-h-screen bg-cyan-200 text-white p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-6xl font-bold text-black italic">Your Boards</h1>

        <div className="bg-gray-800 p-4 rounded-lg mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded text-white cursor-pointer ml-4">
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="New Board..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border border-black rounded-3xl text-gray-600 "
        />
        <button
          onClick={handleCreateBoard}
          className="bg-blue-500 px-4 py-2 rounded cursor-pointer">
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">{board.title}</h2>
              <button
                onClick={(e) => { 
                  e.stopPropagation();
                  deleteBoard(board.id)}}
                className="text-red-400 cursor-pointer">
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
