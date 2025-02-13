import Chat from "@/components/chat"

export default function ChatPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-4xl">
                <Chat />
            </div>
        </main>
    )
} 