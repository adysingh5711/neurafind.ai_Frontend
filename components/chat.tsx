"use client"

import { useState, KeyboardEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Mic, Send, Menu, Plus, Pencil, Check } from "lucide-react"
import MessageList from "./message-list"
import ProductCard from "./product-card"
import VoiceInput from "./voice-input"
import Sidebar from "./sidebar"
import { Button } from "./ui/button"

interface ChatSession {
  id: string
  title: string
  messages: Array<{ role: string; content: string }>
}

export default function Chat() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([{
    id: '1',
    title: 'New Chat',
    messages: [{ role: "assistant", content: "Hello! I'm your AI shopping assistant. How can I help you today?" }]
  }])
  const [currentChatId, setCurrentChatId] = useState('1')
  const [input, setInput] = useState("")
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [productRecommendations, setProductRecommendations] = useState([
    {
      name: "MacBook Pro 16",
      price: 2499.99,
      rating: 4.9,
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202",
      description: "M2 Max, 32GB RAM, 1TB SSD"
    },
    {
      name: "iPhone 15 Pro Max",
      price: 1199.99,
      rating: 4.8,
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708",
      description: "Natural Titanium, 256GB Storage"
    },
    {
      name: "AirPods Pro",
      price: 249.99,
      rating: 4.7,
      image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
      description: "2nd Generation with Active Noise Cancellation"
    }
  ])

  const currentChat = chatSessions.find(chat => chat.id === currentChatId)

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ role: "assistant", content: "Hello! I'm your AI shopping assistant. How can I help you today?" }]
    }
    setChatSessions(prev => [...prev, newChat])
    setCurrentChatId(newChat.id)
    setInput("")
    setIsVoiceInputActive(false)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const updatedSessions = chatSessions.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages, { role: "user", content: input }]
        let updatedTitle = chat.title
        if (chat.title === "New Chat" && chat.messages.length === 1) {
          updatedTitle = input.split(' ').slice(0, 4).join(' ') + '...'
        }
        return {
          ...chat,
          title: updatedTitle,
          messages: updatedMessages
        }
      }
      return chat
    })

    setChatSessions(updatedSessions)
    setInput("")
    if (isVoiceInputActive) {
      setIsVoiceInputActive(false)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return
      }
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRenameChat = (chatId: string) => {
    setEditingChatId(chatId)
    const chat = chatSessions.find(c => c.id === chatId)
    if (chat) {
      setEditTitle(chat.title)
    }
  }

  const saveNewTitle = () => {
    if (!editTitle.trim()) return
    setChatSessions(prev => prev.map(chat => {
      if (chat.id === editingChatId) {
        return { ...chat, title: editTitle.trim() }
      }
      return chat
    }))
    setEditingChatId(null)
    setEditTitle("")
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ role: "assistant", content: "Hello! I'm your AI shopping assistant. How can I help you today?" }]
    };
    setChatSessions([...chatSessions, newChat]);
    setCurrentChatId(newChat.id);
  };

  const handleRename = (chatId: string, newTitle: string) => {
    setChatSessions(chatSessions.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
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
          <h1 className="text-xl font-semibold">AI Shopping Assistant</h1>
        </div>

        {/* Messages and products container with proper padding */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 space-y-6 pb-32">
            <MessageList messages={currentChat?.messages || []} />
            {productRecommendations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productRecommendations.map((product, index) => (
                  <ProductCard key={index} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input container with backdrop */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-3">
              <VoiceInput
                isActive={isVoiceInputActive}
                onEnd={() => { }}
                onClick={() => setIsVoiceInputActive(!isVoiceInputActive)}
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                className="flex-1 bg-gray-800 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/50 resize-none"
                placeholder="Type your message..."
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-full bg-purple-600 hover:bg-purple-700 w-10 h-10 p-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4 stroke-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

