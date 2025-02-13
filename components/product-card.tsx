import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface ProductCardProps {
  name: string
  price: number
  rating: number
  image: string
  description: string
}

export default function ProductCard({ name, price, rating, image, description }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-colors group"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-white">{name}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-purple-400 font-bold">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-300 text-sm">{rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

