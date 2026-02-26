"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send,
    Bot,
    User,
    MoreHorizontal,
    Copy,
    ThumbsUp,
    ThumbsDown,
    RefreshCcw,
    Paperclip,
    Image as ImageIcon,
    Mic,
    Settings
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

const INITIAL_MESSAGE: Message = {
    id: "init-1",
    role: "assistant",
    content: "Hello! I'm your AI assistant. How can I help you with your financial models today?",
    timestamp: new Date()
}

import { submitChat } from "./actions"

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSendMessage = async () => {
        if ((!input.trim() && !selectedFile) || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim() + (selectedFile ? `\n[Attached File: ${selectedFile.name}]` : ""),
            timestamp: new Date()
        }

        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }

        try {
            const formData = new FormData()
            // Pass all messages excluding this latest one (if you prefer, or pass all and Gemini models it)
            // Actually pass all newMessages
            // Strip out [Attached File: ...] in the data sent to gemini if needed, but it's fine
            const historyForApi = newMessages.map(m => ({
                role: m.role,
                content: m.content
            }))
            formData.append("messages", JSON.stringify(historyForApi))

            if (selectedFile) {
                formData.append("file", selectedFile)
            }

            const response = await submitChat(formData)

            if (response.success && response.text) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response.text,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, assistantMessage])
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `Error: ${response.error || "Failed to get a response."}`,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, errorMessage])
            }
        } catch (error) {
            console.error("Chat error:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "An unexpected error occurred. Please try again.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
            setSelectedFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <div className="flex flex-col h-full bg-background relative overflow-hidden">
            {/* Header */}
            <header className="flex-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border p-4 flex justify-between items-center z-10 shrink-0">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">AI Assistant</h1>
                    <p className="text-sm text-muted-foreground">Powered by advanced language models</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-secondary">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Main Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-40 scroll-smooth isolate">
                <div className="max-w-3xl mx-auto space-y-8">
                    <AnimatePresence initial={false}>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <Avatar className={`w-8 h-8 md:w-10 md:h-10 border shadow-sm shrink-0 ${message.role === 'assistant' ? 'bg-primary/10' : 'bg-secondary'}`}>
                                    {message.role === "assistant" ? (
                                        <Bot className="w-5 h-5 text-primary m-auto" />
                                    ) : (
                                        <User className="w-5 h-5 text-secondary-foreground m-auto" />
                                    )}
                                </Avatar>

                                {/* Message Bubble */}
                                <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`px-5 py-3.5 shadow-sm text-[15px] leading-relaxed overflow-x-auto ${message.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                            : "bg-[#f4f4f5] dark:bg-[#27272a] text-foreground rounded-2xl rounded-tl-sm w-full"
                                            }`}
                                    >
                                        {message.role === "user" ? (
                                            <div className="whitespace-pre-wrap">{message.content}</div>
                                        ) : (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-4" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-3 mt-4" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 mt-3" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-3 space-y-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-3 space-y-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-x-auto mb-4 bg-background/50 rounded-lg">
                                                            <table className="border-collapse border border-border w-full text-sm my-2 text-left" {...props} />
                                                        </div>
                                                    ),
                                                    thead: ({ node, ...props }) => <thead className="bg-muted text-muted-foreground font-semibold" {...props} />,
                                                    th: ({ node, ...props }) => <th className="border border-border px-3 py-2 whitespace-nowrap" {...props} />,
                                                    td: ({ node, ...props }) => <td className="border border-border px-3 py-2" {...props} />,
                                                    code: ({ node, ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-primary" {...props} />,
                                                    pre: ({ node, ...props }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-3 text-sm" {...props} />,
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        )}
                                    </div>

                                    {/* Action Buttons (only for assistant) */}
                                    {message.role === "assistant" && (
                                        <div className="flex items-center gap-1 text-muted-foreground/70 mt-1">
                                            <TooltipProvider delayDuration={300}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-foreground">
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Copy</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider delayDuration={300}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-foreground">
                                                            <ThumbsUp className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Good response</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider delayDuration={300}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-foreground">
                                                            <ThumbsDown className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Bad response</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider delayDuration={300}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-foreground">
                                                            <RefreshCcw className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Regenerate</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <Avatar className="w-8 h-8 md:w-10 md:h-10 border shadow-sm bg-primary/10 shrink-0">
                                <Bot className="w-5 h-5 text-primary m-auto" />
                            </Avatar>
                            <div className="bg-[#f4f4f5] dark:bg-[#27272a] px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm min-w-[60px] justify-center">
                                <div className="flex gap-1.5 justify-center items-center h-4">
                                    <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                    <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                    <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-4 md:pb-6 px-4 shrink-0">
                <div className="max-w-3xl mx-auto relative">
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all focus-within:shadow-xl focus-within:ring-1 focus-within:ring-primary/30">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Message AI Assistant..."
                            className="min-h-[60px] max-h-80 w-full resize-none border-0 bg-transparent p-4 pb-12 focus-visible:ring-0 text-[15px] placeholder:text-muted-foreground/70"
                            rows={1}
                        />

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.xlsx,.xls,.xlsm,.csv,.json,image/*"
                        />

                        {selectedFile && (
                            <div className="absolute top-2 left-4 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-2">
                                <span className="truncate max-w-[150px] font-medium">{selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="hover:text-primary/70">
                                    ×
                                </button>
                            </div>
                        )}

                        <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                            <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Attach file</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl hidden sm:flex">
                                            <ImageIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Upload image</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl hidden sm:flex">
                                            <Mic className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Voice input</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <Button
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            className={`absolute bottom-3 right-4 h-8 w-8 rounded-xl transition-all shadow-sm ${input.trim() && !isLoading
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                : "bg-muted text-muted-foreground opacity-70"
                                }`}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-center mt-3 text-xs text-muted-foreground font-medium">
                        AI can make mistakes. Consider verifying important information.
                    </div>
                </div>
            </div>
        </div>
    )
}
