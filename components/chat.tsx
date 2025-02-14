"use client";

import { useState, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send, Menu, Plus, Pencil, Check } from "lucide-react";
import MessageList from "./message-list";
import ProductCard from "./product-card";
import VoiceInput from "./voice-input";
import Sidebar from "./sidebar";
import { Button } from "./ui/button";
import { uploadFileToFirebase } from "../lib/firebaseUtil";

import { AudioRecorder } from "react-audio-voice-recorder";
import { toast } from "sonner";

const addAudioElement = async (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
  console.log("Audio element added to the DOM");

  // Pass the blob, not the object URL, to the upload function
  const url2 = await uploadFileToFirebase(blob, "audio");
  console.log("Audio uploaded to firebase", url2);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Make a POST request to the /transcript endpoint with the Firebase URL
  try {
    const response = await fetch(`${backendURL}/transcript`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioURL: url2 }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const transcriptData = await response.json();
    console.log("Transcription response:", transcriptData);
  } catch (error) {
    console.error("Error posting transcript request:", error);
  }

};


interface ChatSession {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string }>;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "assistant" | "user"; content: string }>
  >([
    {
      role: "assistant",
      content: "Hello! I'm your AI shopping assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Update local messages state
    const newUserMessage = { role: "user", content: input };
    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);

    // Update chat sessions state
    setChatSessions(prev => prev.map(chat =>
      chat.id === currentChatId ? {
        ...chat,
        messages: [...chat.messages, newUserMessage]
      } : chat
    ));

    setIsLoading(true);

    try {
      const payload = {
        query: input,
        history: updatedHistory,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      // Update both state sources with assistant response
      const assistantMessage = { role: "assistant", content: data.answer };
      setMessages(prev => [...prev, assistantMessage]);
      setChatSessions(prev => prev.map(chat =>
        chat.id === currentChatId ? {
          ...chat,
          messages: [...chat.messages, assistantMessage]
        } : chat
      ));

      toast.success("Response received!");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not get a response." },
      ]);
      toast.error("Failed to get a response from the server.");
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    // Implement voice input functionality here
    console.log("Voice input activated");
  };

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          content:
            "Hello! I'm your AI shopping assistant. How can I help you today?",
        },
      ],
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState("1");
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          content:
            "Hello! I'm your AI shopping assistant. How can I help you today?",
        },
      ],
    };
    setChatSessions((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
    setInput("");
    setIsVoiceInputActive(false);
  };

  const handleRenameChat = (chatId: string) => {
    setEditingChatId(chatId);
    const chat = chatSessions.find((c) => c.id === chatId);
    if (chat) {
      setEditTitle(chat.title);
    }
  };

  const saveNewTitle = () => {
    if (!editTitle.trim()) return;
    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === editingChatId) {
          return { ...chat, title: editTitle.trim() };
        }
        return chat;
      })
    );
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          content:
            "Hello! I'm your AI shopping assistant. How can I help you today?",
        },
      ],
    };
    setChatSessions([...chatSessions, newChat]);
    setCurrentChatId(newChat.id);
  };

  const handleRename = (chatId: string, newTitle: string) => {
    setChatSessions(
      chatSessions.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar with higher z-index */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-72 bg-gray-800/95 backdrop-blur-sm z-50 border-r border-gray-700"
          >
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              chatHistory={chatSessions}
              onChatSelect={(id) => setCurrentChatId(id)}
              onNewChat={handleNewChat}
              onRename={handleRename}
              currentChatId={currentChatId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-800">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-gray-800 p-2 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Neurafind AI</h1>
        </div>

        {/* Messages and products container with proper padding */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 space-y-6 pb-32">
            <MessageList messages={messages} />
          </div>
        </div>

        {/* Input container with backdrop */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-3">
              <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                className="flex-1 bg-gray-800 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/50 resize-none"
                placeholder="Type your message..."
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-purple-600 hover:bg-purple-700 w-10 h-10 p-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4 stroke-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
