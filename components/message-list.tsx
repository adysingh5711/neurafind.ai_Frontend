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
            {message.content.split('\n').map((paragraph, index) => (
              <p key={index} className="font-thin mb-2 last:mb-0">
                {paragraph.split('**').map((text, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="font-bold">{text}</strong>
                  ) : (
                    text
                  )
                )}
              </p>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
