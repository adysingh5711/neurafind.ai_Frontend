import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: Array<{ id: string; title: string; messages: Array<{ role: string; content: string }> }>;
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, title: string) => void;
  currentChatId: string;
}

export default function Sidebar({
  isOpen,
  onToggle,
  chatHistory,
  onChatSelect,
  onNewChat,
  onRename,
  currentChatId
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEditStart = (chatId: string, currentTitle: string) => {
    setEditingId(chatId);
    setEditValue(currentTitle);
  };

  const handleEditSave = (chatId: string) => {
    if (editValue.trim()) {
      onRename(chatId, editValue.trim());
    }
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -250, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="bg-gray-800 h-full overflow-y-auto p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-semibold">Chat History</h2>
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
          <ul className="space-y-2">
            {chatHistory.map((chat) => (
              <li
                key={chat.id}
                onClick={() => editingId !== chat.id && onChatSelect(chat.id)}
                className={`group flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-colors
                  ${chat.id === currentChatId ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                {editingId === chat.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(chat.id);
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      className="flex-1 bg-gray-900 text-white px-3 py-1.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditSave(chat.id)}
                      className="p-1.5 hover:bg-gray-600 rounded-full"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="p-1.5 hover:bg-gray-600 rounded-full"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-300 truncate flex-1 px-2">
                      {chat.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(chat.id, chat.title);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-600 rounded-full transition-opacity"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
