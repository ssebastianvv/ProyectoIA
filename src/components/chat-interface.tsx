'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { MessageSquare, Send, ChevronRight, ChevronLeft, Plus, Settings, Moon, Sun } from 'lucide-react'
import { cn } from "@/lib/utils"

// Definición de interfaces para mensajes y conversaciones
interface Message {
    id: number
    content: string
    isUser: boolean
}

interface Conversation {
    id: number
    title: string
    messages: Message[]
}

// Conversaciones iniciales
const INITIAL_CONVERSATIONS: Conversation[] = [
    { id: 1, title: "React Hooks", messages: [] },
    { id: 2, title: "CSS Grid", messages: [] },
    { id: 3, title: "TypeScript Basics", messages: [] },
]

// Sugerencias de comandos
const SUGGESTIONS = [
    "Explica useEffect en React",
    "Cómo crear un layout con CSS Grid",
    "Diferencias entre interface y type en TypeScript",
]

export function ChatInterface() {
    // Definición de estados
    const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
    const [activeConversation, setActiveConversation] = useState<number>(1)
    const [input, setInput] = useState("")
    const [isHistoryOpen, setIsHistoryOpen] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isAiTyping, setIsAiTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Efecto para desplazar la vista hacia el último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [conversations])

    // Efecto para manejar el modo oscuro basado en las preferencias del sistema
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDarkMode(darkModeMediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
        darkModeMediaQuery.addEventListener('change', handleChange)

        return () => darkModeMediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Efecto para aplicar la clase 'dark' al elemento raíz del documento
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])

    // Función para enviar un mensaje
    const handleSend = () => {
        if (input.trim()) {
            const newMessage: Message = { id: Date.now(), content: input, isUser: true }
            setConversations(prevConversations =>
                prevConversations.map(conv =>
                    conv.id === activeConversation
                        ? { ...conv, messages: [...conv.messages, newMessage] }
                        : conv
                )
            )
            setInput("")
            setShowSuggestions(false)
            setIsAiTyping(true)

            // Simular respuesta de la IA
            setTimeout(() => {
                const aiResponse: Message = {
                    id: Date.now() + 1,
                    content: "Esta es una respuesta simulada de la IA. Puedo proporcionar más información si lo necesitas.",
                    isUser: false
                }
                setConversations(prevConversations =>
                    prevConversations.map(conv =>
                        conv.id === activeConversation
                            ? { ...conv, messages: [...conv.messages, aiResponse] }
                            : conv
                    )
                )
                setIsAiTyping(false)
            }, 2000)
        }
    }

    // Función para alternar el modo oscuro
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    // Función para agregar una nueva conversación
    const addNewConversation = () => {
        const newConv: Conversation = {
            id: conversations.length + 1,
            title: `Nueva conversación ${conversations.length + 1}`,
            messages: []
        }
        setConversations([...conversations, newConv])
        setActiveConversation(newConv.id)
    }

    return (
        <div className={cn("flex h-screen bg-background", isDarkMode ? 'dark' : '')}>
            {/* Sidebar */}
            <aside className={cn(
                "w-80 border-r bg-card transition-transform duration-300 fixed h-full z-40",
                isHistoryOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">Historial</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4">
                    <Button variant="outline" className="w-full" onClick={addNewConversation}>
                        <Plus className="mr-2 h-4 w-4" /> Nueva conversación
                    </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="p-4">
                        {conversations.map((conv) => (
                            <Button
                                key={conv.id}
                                variant={activeConversation === conv.id ? "secondary" : "ghost"}
                                className="w-full justify-start mb-1"
                                onClick={() => setActiveConversation(conv.id)}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {conv.title}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* Main content */}
            <main className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isHistoryOpen ? "ml-80" : "ml-0"
            )}>
                <header className="border-b p-4 flex justify-between items-center bg-card">
                    {!isHistoryOpen && (
                        <Button variant="ghost" onClick={() => setIsHistoryOpen(true)}>
                            <ChevronRight className="h-4 w-4 mr-2" />
                            Historial
                        </Button>
                    )}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <Tabs
                    value={activeConversation.toString()}
                    onValueChange={(value) => setActiveConversation(parseInt(value))}
                    className="flex-1 flex flex-col"
                >
                    <TabsList className="justify-start px-4 border-b">
                        {conversations.map((conv) => (
                            <TabsTrigger key={conv.id} value={conv.id.toString()}>
                                {conv.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {conversations.map((conv) => (
                        <TabsContent
                            key={conv.id}
                            value={conv.id.toString()}
                            className="flex-1 p-4 overflow-auto"
                        >
                            <ScrollArea className="h-full">
                                {conv.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn("mb-4", message.isUser ? "text-right" : "text-left")}
                                    >
                                        <Card className={cn(
                                            "inline-block p-4 max-w-[80%]",
                                            message.isUser
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}>
                                            {message.content}
                                        </Card>
                                    </div>
                                ))}
                                {isAiTyping && (
                                    <div className="text-muted-foreground">
                                        La IA está escribiendo...
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="border-t p-4 bg-card">
                    <div className="max-w-4xl mx-auto relative flex gap-2">
                        {/* Textarea para escribir el mensaje */}
                        <Textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                setShowSuggestions(e.target.value.startsWith('/'))
                            }}
                            placeholder="Escribe tu mensaje aquí... (Usa '/' para ver sugerencias)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            className="resize-none"
                            rows={1}
                        />
                        {/* Botón para enviar el mensaje */}
                        <Button onClick={handleSend}>
                            <Send className="h-4 w-4" />
                        </Button>
                        {/* Sugerencias de comandos */}
                        {showSuggestions && (
                            <Card className="absolute bottom-full left-0 w-full mb-2">
                                {SUGGESTIONS.map((suggestion, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            setInput(suggestion)
                                            setShowSuggestions(false)
                                        }}
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}