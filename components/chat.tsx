"use client";

import { useState, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Send } from "lucide-react";
import MessageList from "./message-list";
import Sidebar from "./sidebar";
import { Button } from "./ui/button";
import { uploadFileToFirebase } from "../lib/firebaseUtil";
import { AudioRecorder } from "react-audio-voice-recorder";
import { toast } from "sonner";

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
      content:
        "Hello! I'm your AI shopping assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Send a chat message. If a transcript (customMessage) is passed, that text is sent.
   */
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage !== undefined ? customMessage : input;
    if (!textToSend.trim()) return;

    const newUserMessage = { role: "user", content: textToSend };
    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);

    // Update chat session state
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newUserMessage] }
          : chat
      )
    );

    setIsLoading(true);
    try {
      const payload = {
        query: textToSend,
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
        throw new Error(`Chat error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.answer };
      setMessages((prev) => [...prev, assistantMessage]);
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        )
      );
      toast.success("Response received!");
    } catch (error) {
      console.error("Error sending chat message:", error);
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

  /**
   * Called when audio recording completes.
   * Uploads the audio, retrieves its transcript, and then sends the transcript as a message.
   */
  const addAudioElement = async (blob: Blob) => {
    try {
      // Create a blob URL (for debugging if needed)
      const blobUrl = URL.createObjectURL(blob);
      console.log("Audio blob URL:", blobUrl);

      // Removed: appending an audio element to the DOM to avoid cluttering the UI.
      // If you need to debug audio playback, consider rendering it conditionally in a separate container.

      // Upload the audio blob to Firebase
      const firebaseUrl = await uploadFileToFirebase(blob, "audio");
      console.log("Uploaded audio URL:", firebaseUrl);

      const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendURL) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not set.");
        return;
      }

      const transcriptResponse = await fetch(`${backendURL}/transcript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioURL: firebaseUrl }),
      });

      if (!transcriptResponse.ok) {
        const transcriptError = await transcriptResponse.text();
        throw new Error(
          `Transcript endpoint error: ${transcriptResponse.status} - ${transcriptError}`
        );
      }

      const transcriptData = await transcriptResponse.json();
      console.log("Transcript data:", transcriptData);

      // Use the correct field ("transcription") from your backend response.
      const transcriptText = transcriptData.transcription || transcriptData.text;
      if (!transcriptText) {
        console.error("Transcript text not found in response:", transcriptData);
        toast.error("Transcript text is empty.");
        return;
      }

      // Send the transcript as a chat message.
      handleSendMessage(transcriptText);
    } catch (error) {
      console.error("Error processing audio transcript:", error);
      toast.error("Error processing audio transcript.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
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
              onNewChat={() => { }}
              onRename={() => { }}
              currentChatId={currentChatId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative ml-72">
        <div
          className={`flex items-center gap-4 p-4 border-b border-gray-800`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-gray-800 p-2 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Neurafind AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <MessageList messages={messages} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 flex items-center gap-3">
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
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-purple-600 hover:bg-purple-700 w-10 h-10 p-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4 stroke-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
