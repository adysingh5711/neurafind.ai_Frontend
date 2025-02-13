"use client"

import { motion } from "framer-motion"
import { Smartphone, Shirt, ShoppingBag, Camera, BookOpen, Headphones } from "lucide-react"

const items = [
  {
    icon: Smartphone,
    delay: 0,
    className: "text-purple-400/80"
  },
  {
    icon: Shirt,
    delay: 1,
    className: "text-pink-400/80"
  },
  {
    icon: ShoppingBag,
    delay: 2,
    className: "text-blue-400/80"
  },
  {
    icon: Headphones,
    delay: 3,
    className: "text-green-400/80"
  },
  {
    icon: Camera,
    delay: 4,
    className: "text-yellow-400/80"
  },
  {
    icon: BookOpen,
    delay: 5,
    className: "text-red-400/80"
  }
]

export function FloatingPaper() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              y: [-20, -40, -20],
              x: [-20, 20, -20],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 6,
              delay: item.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className={`absolute ${getRandomPosition(index)} p-4 bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10`}
          >
            <Icon className={`w-8 h-8 ${item.className}`} />
          </motion.div>
        )
      })}
    </div>
  )
}

function getRandomPosition(index: number) {
  const positions = [
    "top-[20%] left-[20%]",
    "top-[30%] right-[25%]",
    "bottom-[40%] left-[30%]",
    "bottom-[30%] right-[20%]",
    "top-[45%] left-[40%]",
    "bottom-[25%] right-[35%]"
  ]
  return positions[index] || positions[0]
}

