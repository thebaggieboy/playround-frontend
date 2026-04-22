"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send, Bot, User, MoreHorizontal, Copy, ThumbsUp, ThumbsDown,
    RefreshCcw, Paperclip, Image as ImageIcon, Mic, Settings,
    Database, ChevronDown, X as XIcon, ArrowDown, Plus, MessageSquare, Trash2
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

interface ChatSession {
    id: string
    title: string
    financial_model: number | null
    created_at: string
    updated_at: string
}

import { submitChat } from "./actions"

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Chat History Management
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const [isLoadingSessions, setIsLoadingSessions] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Model grounding
    const token = useSelector(selectToken)
    const [models, setModels] = useState<{ id: string; name: string }[]>([])
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
    const [modelContext, setModelContext] = useState<string | null>(null)
    const [isLoadingContext, setIsLoadingContext] = useState(false)
    const [showModelPicker, setShowModelPicker] = useState(false)

    const getAuthToken = () => {
        if (!token) return ''
        if (typeof token === 'string') return token
        if (typeof token === 'object' && (token as any).access) return (token as any).access
        return ''
    }

    // Load available models
    useEffect(() => {
        fetch(`${API_BASE_URL}/models/`, {
            headers: { 'Authorization': `JWT ${getAuthToken()}` }
        }).then(r => r.json()).then(d => {
            const list = Array.isArray(d) ? d : (d.results || [])
            setModels(list.map((m: any) => ({ id: m.id, name: m.name })))
        }).catch(() => {})
    }, [token])

    // Load user's chat sessions
    useEffect(() => {
        loadSessions()
    }, [token])

    const loadSessions = async () => {
        setIsLoadingSessions(true)
        try {
            const res = await fetch(`${API_BASE_URL}/chat-sessions/`, {
                headers: { 'Authorization': `JWT ${getAuthToken()}` }
            })
            if (res.ok) {
                const data = await res.json()
                const list = Array.isArray(data) ? data : (data.results || [])
                setSessions(list)
            }
        } catch (err) {
            console.error("Failed to load chat sessions:", err)
        } finally {
            setIsLoadingSessions(false)
        }
    }

    const loadSession = async (sessionId: string) => {
        setActiveSessionId(sessionId)
        setMessages([])
        setIsLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/chat-sessions/${sessionId}/`, {
                headers: { 'Authorization': `JWT ${getAuthToken()}` }
            })
            if (res.ok) {
                const data = await res.json()
                // Set messages
                if (data.messages) {
                    setMessages(data.messages.map((m: any) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        timestamp: new Date(m.timestamp)
                    })))
                }
                
                // If it has a financial model, try fetching context
                if (data.financial_model) {
                    await loadModelContext(data.financial_model.toString(), false)
                } else {
                    setSelectedModelId(null)
                    setModelContext(null)
                }
                
                if (window.innerWidth < 768) {
                    setIsSidebarOpen(false)
                }
            }
        } catch (err) {
            console.error("Failed to load session details:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const startNewChat = () => {
        setActiveSessionId(null)
        setMessages([])
        setSelectedModelId(null)
        setModelContext(null)
        setInput("")
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false)
        }
    }

    const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to delete this chat?")) return
        
        try {
            const res = await fetch(`${API_BASE_URL}/chat-sessions/${sessionId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `JWT ${getAuthToken()}` }
            })
            if (res.ok) {
                setSessions(prev => prev.filter(s => s.id !== sessionId))
                if (activeSessionId === sessionId) {
                    startNewChat()
                }
            }
        } catch (err) {
            console.error("Failed to delete chat session:", err)
        }
    }

    const loadModelContext = async (modelId: string, manualSelect = true) => {
        setIsLoadingContext(true)
        try {
            const res = await fetch(`${API_BASE_URL}/models/${modelId}/`, {
                headers: { 'Authorization': `JWT ${getAuthToken()}` }
            })
            const data = await res.json()
            
            const scenarioSummaries = (data.scenarios || []).map((s: any) => {
                const macro = s.macro_assumptions || {}
                const opex = s.operating_expenses || {}
                const capex = s.capital_expenditure || {}
                const debt = s.debt_financing || {}
                const tax = s.tax_assumptions || {}
                const wc = s.working_capital || {}
                
                const inputsSummary = [
                    `Macro: ${macro.reporting_currency || 'USD'} reporting, ${macro.local_inflation_rate || 0}% local inflation, ${macro.discount_rate_wacc || 0}% WACC`,
                    `Revenue Products: ${(s.revenue_products || []).map((p: any) => `${p.product_name} ($${p.unit_price_year_1}/unit)`).join(', ') || 'None'}`,
                    `OPEX: $${opex.average_annual_salary || 0} avg salary, ${opex.total_headcount || 0} headcount`,
                    `CAPEX: $${capex.construction_building_cost || 0} construction, $${capex.equipment_machinery_cost || 0} equipment`,
                    `DEBT: ${debt.debt_percentage || 0}% leverage, ${debt.loan_tenor_years || 0}yr tenor`,
                    `TAX: ${tax.corporate_income_tax_rate || 0}% CIT, ${tax.vat_sales_tax_rate || 0}% VAT`,
                    `WORKING CAPITAL: ${wc.receivables_days_dso || 0} days AR, ${wc.payables_days_dpo || 0} days AP`
                ].join('\n- ')

                const inputsText = `[INPUT ASSUMPTIONS - ${s.name || 'Base'}]\n- ${inputsSummary}`

                const stmts = s.calculated_statements || []
                const outputSummary = stmts.map((st: any) => {
                    const periods = Object.keys(st.data || {})
                    if (periods.length === 0) return `[OUTPUT: ${st.statement_type}] - No data`
                    const lastPeriod = periods[periods.length - 1]
                    const summaryLine = Object.entries(st.data || {})
                        .map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v[v.length - 1] : (typeof v === 'object' ? (v as Record<string,any>)[lastPeriod] : v)}`)
                        .slice(0, 8).join('\n')
                    return `[OUTPUT: ${st.statement_type} - Year ${lastPeriod}]\n${summaryLine}`
                }).join('\n\n')

                return `${inputsText}\n\n${outputSummary}`
            }).join('\n\n---\n\n')

            const ctx = `CONTEXT: You are analyzing "${data.name}".\nProject Type: ${data.project_type || 'General'}\n\n${scenarioSummaries}`
            setModelContext(ctx)
            setSelectedModelId(modelId)
            
            // If user manually changed model for an active session, update it in DB
            if (manualSelect && activeSessionId) {
                await fetch(`${API_BASE_URL}/chat-sessions/${activeSessionId}/`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `JWT ${getAuthToken()}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ financial_model: parseInt(modelId) })
                })
                setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, financial_model: parseInt(modelId) } : s))
            }
        } catch (err) {
            console.error("Failed to load model context:", err)
            setModelContext(null)
        } finally {
            setIsLoadingContext(false)
            setShowModelPicker(false)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop - clientHeight > 100) {
            setShowScrollButton(true)
        } else {
            setShowScrollButton(false)
        }
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

    // Function to save message to database
    const saveMessageToDb = async (sessionId: string, role: string, content: string) => {
        try {
            await fetch(`${API_BASE_URL}/chat-sessions/${sessionId}/messages/`, {
                method: 'POST',
                headers: { 
                    'Authorization': `JWT ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role, content })
            })
        } catch (err) {
            console.error("Failed to save message:", err)
        }
    }

    const handleSendMessage = async () => {
        if ((!input.trim() && !selectedFile) || isLoading) return

        const messageContent = input.trim() + (selectedFile ? `\n[Attached File: ${selectedFile.name}]` : "")
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: messageContent,
            timestamp: new Date()
        }

        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }

        let currentSessionId = activeSessionId

        try {
            // Create session if it doesn't exist
            if (!currentSessionId) {
                const title = messageContent.substring(0, 40) + (messageContent.length > 40 ? "..." : "")
                const res = await fetch(`${API_BASE_URL}/chat-sessions/`, {
                    method: 'POST',
                    headers: { 'Authorization': `JWT ${getAuthToken()}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        title: title || 'New Chat',
                        financial_model: selectedModelId ? parseInt(selectedModelId) : null
                    })
                })
                if (res.ok) {
                    const data = await res.json()
                    currentSessionId = data.id
                    setActiveSessionId(currentSessionId)
                    setSessions(prev => [data, ...prev])
                }
            }

            // Save User message to DB seamlessly
            if (currentSessionId) {
                await saveMessageToDb(currentSessionId, "user", messageContent)
            }

            // Send to Gemini
            const formData = new FormData()
            const historyForApi = newMessages.map(m => ({
                role: m.role,
                content: m.content
            }))
            formData.append("messages", JSON.stringify(historyForApi))

            if (selectedFile) {
                formData.append("file", selectedFile)
            }

            if (modelContext) {
                formData.append("modelContext", modelContext)
            }

            const response = await submitChat(formData)

            let assistantContent = ""
            if (response.success && response.text) {
                assistantContent = response.text
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: assistantContent,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, assistantMessage])
            } else {
                assistantContent = `Error: ${response.error || "Failed to get a response."}`
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: assistantContent,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, errorMessage])
            }

            // Save Assistant message to DB
            if (currentSessionId) {
                await saveMessageToDb(currentSessionId, "assistant", assistantContent)
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
        <div className="flex h-full bg-background overflow-hidden relative">
            
            {/* Sidebar Toggle for Mobile */}
            {!isSidebarOpen && (
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-md shadow-md"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <MessageSquare className="h-4 w-4" />
                </Button>
            )}

            {/* Sidebar Data Container */}
            <div className={`
                absolute md:static top-0 left-0 h-full z-40 bg-card border-r border-border
                ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'}
                transition-all duration-300 flex flex-col shrink-0 overflow-hidden
            `}>
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="font-semibold tracking-tight">Chat History</h2>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="p-3">
                    <Button 
                        onClick={startNewChat} 
                        className="w-full justify-start shadow-sm"
                        variant={activeSessionId === null ? "default" : "outline"}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Chat
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                    {isLoadingSessions ? (
                        <div className="text-xs text-center text-muted-foreground mt-4 animate-pulse">Loading past chats...</div>
                    ) : sessions.length === 0 ? (
                        <div className="text-xs text-center text-muted-foreground mt-4">No past chats yet.</div>
                    ) : (
                        sessions.map(session => (
                            <div 
                                key={session.id}
                                onClick={() => loadSession(session.id)}
                                className={`
                                    w-full text-left px-3 py-2.5 rounded-lg text-[13px] flex items-center justify-between group cursor-pointer transition-colors
                                    ${activeSessionId === session.id ? 'bg-secondary text-primary font-medium' : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'}
                                `}
                            >
                                <span className="truncate pr-2">{session.title}</span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0"
                                    onClick={(e) => deleteSession(e, session.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                {/* Header */}
                <header className="flex-none bg-background border-b border-border p-4 flex flex-col md:flex-row gap-3 z-10 shrink-0 md:items-center justify-between pl-[4.5rem] md:pl-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">AI Assistant</h1>
                        <p className="text-xs text-muted-foreground">Powered by Gemini · {modelContext ? `Grounded on "${models.find(m => m.id === selectedModelId)?.name}"` : 'No model loaded'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Model selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowModelPicker(!showModelPicker)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-secondary transition-colors"
                            >
                                <Database className="w-3.5 h-3.5 text-primary" />
                                {selectedModelId ? models.find(m => m.id === selectedModelId)?.name || 'Model' : 'Load Model'}
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            </button>
                            {showModelPicker && (
                                <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                                    <div className="p-2 border-b border-border">
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2">Your Models</p>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto py-1">
                                        {models.length === 0 ? (
                                            <p className="text-xs text-muted-foreground px-4 py-3">No models found.</p>
                                        ) : models.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => loadModelContext(m.id)}
                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-secondary transition-colors ${selectedModelId === m.id ? 'text-primary font-semibold' : ''}`}
                                            >
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedModelId && (
                                        <div className="border-t border-border p-2">
                                            <button
                                                onClick={() => { setSelectedModelId(null); setModelContext(null); setShowModelPicker(false) }}
                                                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                            >
                                                <XIcon className="w-3 h-3" />
                                                Remove model context
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Context indicator */}
                {isLoadingContext && (
                    <div className="absolute top-[4.5rem] md:top-[4.5rem] left-0 w-full z-20 text-xs text-center p-1 bg-background border-b animate-pulse text-muted-foreground">Loading model data...</div>
                )}
                {modelContext && !isLoadingContext && (
                    <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 border-b border-green-200 dark:border-green-800 z-10 shrink-0">
                        <Database className="w-3 h-3" />
                        <span>Model data loaded — AI will answer using real financial figures</span>
                    </div>
                )}

                {/* Scrollable Messages Area */}
                <div onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 pb-6 scroll-smooth">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {messages.length === 0 && !isLoading && (
                            <>
                                <div className="flex flex-col items-center text-center pt-8 pb-0 px-4 md:px-12 lg:px-20">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 shadow-sm border border-primary/20">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-medium tracking-tight text-foreground">
                                        How can I help you today?
                                    </h2>
                                    <p className="mt-1.5 text-[13px] text-muted-foreground max-w-md leading-relaxed">
                                        Ask me anything about your financial models — revenue, OPEX, debt structure, cash flow, and more. Load a model above for grounded, data-driven answers.
                                    </p>
                                    {!selectedModelId && (
                                        <Button 
                                            onClick={() => setShowModelPicker(true)}
                                            variant="outline" 
                                            className="mt-6 border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors hover:border-primary shadow-sm"
                                        >
                                            <Database className="w-4 h-4 mr-2 text-primary" />
                                            Select a Financial Model
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    {[
                                        { title: "Summarize Revenue", desc: "Get a breakdown of revenue per scenario", icon: "📊" },
                                        { title: "Highest OPEX?", desc: "Which operational expense is the largest?", icon: "💸" },
                                        { title: "Profitability Timing", desc: "When does the business turn cash-flow positive?", icon: "⏱️" },
                                        { title: "Debt Capacity", desc: "Analyze the debt service coverage ratio", icon: "🏦" }
                                    ].map((chip) => (
                                        <button
                                            key={chip.title}
                                            onClick={() => { setInput(chip.title); handleSendMessage() }}
                                            className="flex flex-col items-start p-3 md:p-3.5 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all text-left shadow-sm group"
                                        >
                                            <span className="text-lg mb-1.5">{chip.icon}</span>
                                            <span className="text-[13px] font-medium group-hover:text-primary transition-colors">{chip.title}</span>
                                            <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{chip.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <Avatar className={`w-8 h-8 md:w-10 md:h-10 border shadow-sm shrink-0 ${message.role === 'assistant' ? 'bg-primary/10' : 'bg-secondary'}`}>
                                        {message.role === "assistant" ? (
                                            <Bot className="w-5 h-5 text-primary m-auto" />
                                        ) : (
                                            <User className="w-5 h-5 text-secondary-foreground m-auto" />
                                        )}
                                    </Avatar>

                                    <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                                        <div
                                            className={`px-5 py-3.5 shadow-md text-[15px] leading-relaxed overflow-x-auto border ${message.role === "user"
                                                ? "bg-primary text-primary-foreground border-primary/80 rounded-2xl rounded-tr-sm w-fit"
                                                : "bg-card dark:bg-muted/30 text-foreground border-border/50 rounded-2xl rounded-tl-sm w-full"
                                                }`}
                                        >
                                            {message.role === "user" ? (
                                                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
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
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

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
                <div className="flex-none bg-background/95 backdrop-blur-sm px-4 pb-4 md:pb-5 pt-3 w-full shrink-0">
                    <div className="max-w-3xl mx-auto relative w-full border border-border/80 rounded-2xl bg-card shadow-sm transition-all focus-within:shadow-md focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
                        
                        <AnimatePresence>
                            {showScrollButton && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute -top-12 left-1/2 -translate-x-1/2 z-50"
                                >
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={scrollToBottom}
                                        className="h-8 w-8 rounded-full shadow-lg border border-border/50 bg-card hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                            <div className="absolute top-2 left-4 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-2 max-w-[calc(100%-80px)]">
                                <span className="truncate font-medium">{selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="hover:text-primary/70 ml-1">
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
                        </div>

                        <Button
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={!input.trim() && !selectedFile || isLoading}
                            className={`absolute bottom-3 right-4 h-8 w-8 rounded-xl transition-all shadow-sm ${input.trim() || selectedFile && !isLoading
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
