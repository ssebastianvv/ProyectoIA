"use client"

// Importamos los componentes necesarios y los íconos
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageSquare, Moon, Plus, SendHorizontal, Settings, Sun } from "lucide-react"
import { cn } from "@/lib/utils" // Utilidad para combinar clases CSS condicionalmente
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react" // Hook para manejar el estado
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Chat() {
  // Estados para manejar diferentes funcionalidades
  const [isDarkMode, setIsDarkMode] = useState(false) // Estado para modo oscuro
  const [isHistoryOpen, setIsHistoryOpen] = useState(true) // Estado para mostrar/ocultar historial
  const [message, setMessage] = useState("") // Estado para el mensaje que el usuario escribe
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]) // Estado para almacenar los mensajes del chat
  const [loading, setLoading] = useState(false) // Estado para indicar si el mensaje está enviándose

  // Función para alternar entre modo oscuro y claro
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  // Función que se ejecuta al enviar un mensaje
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Evitamos el comportamiento por defecto del formulario
    if (!message.trim()) return // Si el mensaje está vacío, no hacemos nada

    // Agregamos el mensaje del usuario al estado del chat
    const newChat = [...chat, { role: "user", content: message }]
    setChat(newChat) // Actualizamos el estado del chat
    setMessage("") // Limpiamos el campo del mensaje
    setLoading(true) // Indicamos que el mensaje está enviándose

    try {
      // Hacemos una petición a la API para obtener una respuesta del asistente
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error desconocido") // Si hay un error, lo lanzamos
      }

      const data = await response.json() // Obtenemos la respuesta de la API
      // Agregamos la respuesta del asistente al estado del chat
      setChat([...newChat, { role: "assistant", content: data.reply }])
    } catch (error) {
      console.error("Error:", error) // Mostramos el error en consola
      // Agregamos un mensaje de error al chat
      setChat([...newChat, { role: "assistant", content: "Error de conexión." }])
    } finally {
      setLoading(false) // Indicamos que terminó de cargarse
    }
  }

  return (
    <div className={cn("flex h-screen bg-background", isDarkMode ? "dark" : "")}> {/* Contenedor principal */}
      {/* Barra lateral para el historial de mensajes */}
      <aside
        className={cn(
          "w-80 border-r bg-card transition-transform duration-300 fixed h-full z-40",
          isHistoryOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 flex justify-between items-center border-b"> {/* Encabezado del historial */}
          <h2 className="text-xl  font-semibold text-foreground  ">Historial</h2>
          <Button variant="ghost" size="icon" className="bg-accent" onClick={() => setIsHistoryOpen(false)}>
            <ChevronLeft className="h-4 w-4 text-primary-foreground" />
          </Button>
        </div>
        <div className="p-4" > {/* Botón para crear un nuevo historial */}
          <Button className="w-full bg-accent">
            <Plus className="mr-2 h-4 w-4 " /> Historial
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]"> {/* Área para scroll del historial */}
          <div className="p-4 space-y-2 ">
            {/* Mostramos los mensajes del historial */}
            {chat
              .filter((msg) => msg.role === "user") // Filtramos solo mensajes del usuario
              .map((msg, index) => (
                <Button key={index} variant="ghost" className="w-full justify-start text-left  ">
                  <MessageSquare className="mr-2 h-4 w-4  " />
                  {msg.content.substring(0, 20)}... {/* Mostramos los primeros 20 caracteres del mensaje */}
                </Button>
              ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Área principal del chat */}
      <main className={cn("flex-1 flex flex-col transition-all duration-300 ", isHistoryOpen ? "ml-80" : "ml-0")}>
        <header className="border-b p-4 flex justify-between items-center bg-card"> {/* Encabezado del chat */}
          {!isHistoryOpen && (
            <Button variant="ghost" className="bg-accent text-primary-foreground" onClick={() => setIsHistoryOpen(true)}>
              <ChevronRight className="h-4 w-4 mr-2 " />
              Historial
            </Button>
          )}
          <div className="flex items-center gap-2"> {/* Botones de modo oscuro y configuración */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-4 w-4 text-primary-foreground " /> : <Moon className="h-4 w-4 " />}
            </Button>
            <Button variant="ghost" size="icon"  >
              <Settings className="text-foreground h-4 w-4 " />
            </Button>
          </div>
        </header>
        <Tabs className="flex-1 flex flex-col"> {/* Contenedor para los mensajes */}
          <ScrollArea className="flex-1 p-4"> {/* Área para scroll del chat */}
            <div className="max-w-2xl mx-auto space-y-4">
              {chat.map((c, i) => (
                <div key={i} className={cn("flex", c.role === "user" ? "justify-end" : "justify-start")}> {/* Mensajes del chat */}
                  <div
                    className={cn(
                      "flex items-start gap-2 max-w-[80%]",
                      c.role === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <Avatar> {/* Avatar del usuario o asistente */}
                      <AvatarFallback>{c.role === "user" ? "TU" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        c.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {c.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start"> {/* Indicador de carga */}
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">La IA está escribiendo...</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
        <div className="border-t p-4 bg-card"> {/* Formulario para enviar mensajes */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Actualizamos el mensaje que escribe el usuario
              placeholder="Escribe tu mensaje aquí..."
              className="resize-none flex-grow"
              rows={2} // Definimos el tamaño del área de texto
            />
            <Button className="bg-accent" type="submit" disabled={loading} > {/* Botón para enviar mensajes */}
              <SendHorizontal className="h-4 w-4 mr-2" />
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
