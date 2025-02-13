import { motion } from "framer-motion"

interface Message {
  role: string
  content: string
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${message.role === "user"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-white border border-gray-700"
              }`}
          >
            {message.content}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
