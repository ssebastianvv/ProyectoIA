"use client"; // Habilita el modo cliente en Next.js para que este componente se renderice del lado del cliente

import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react"; // Importa el hook useState para manejar el estado en el componente

export default function Chat() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Estado para manejar el mensaje del usuario
  const [message, setMessage] = useState("");

  // Estado para almacenar el historial de chat (roles y contenido)
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);

  // Estado para controlar si la solicitud está en curso
  const [loading, setLoading] = useState(false);

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario (recargar la página)

    // Valida que el mensaje no esté vacío
    if (!message.trim()) return;

    // Agrega el mensaje del usuario al historial de chat
    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat); // Actualiza el estado del chat
    setMessage(""); // Limpia el campo de texto
    setLoading(true); // Indica que se está procesando la solicitud

    try {
      // Realiza una solicitud POST al endpoint de la API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Especifica el tipo de contenido
        body: JSON.stringify({ message }), // Envía el mensaje del usuario en el cuerpo de la solicitud
      });

      // Maneja errores de la solicitud
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido"); // Lanza un error si la solicitud falla
      }

      // Obtiene la respuesta de la API y la agrega al historial de chat
      const data = await response.json();
      setChat([...newChat, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error:", error); // Registra el error en la consola
      setChat([
        ...newChat,
        { role: "assistant", content: "Error de conexión." },
      ]); // Muestra un mensaje de error en el chat
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  return (
    <div
      className={cn("flex h-screen bg-background", isDarkMode ? "dark" : "")}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Chat con OpenAI</h1>

        {/* Muestra el historial del chat */}
        <div className="mb-6">
          {chat.map((c, i) => (
            <div key={i} className="mb-2">
              <strong>{c.role === "user" ? "Tú" : "IA"}:</strong> {c.content}
            </div>
          ))}
        </div>

        {/* Formulario para enviar mensajes */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-t p-4 bg-card">
            <div className="max-w-4xl mx-auto relative flex gap-2">
              <Textarea
                value={message} // Vincula el estado del mensaje al valor del textarea
                onChange={(e) => setMessage(e.target.value)} // Actualiza el estado del mensaje al escribir
                rows={3}
                placeholder="Escribe tu mensaje aquí..."
                className="resize-none"
                rows={2}
              />
              <Button
                type="submit"
                disabled={loading} // Deshabilita el botón si está en estado de carga
                className="px-4 py-2 bg-[#FCA311] text-white rounded disabled:bg-gray-400"
              >
                <SendHorizonal className="h-4 w-4" />
                {loading ? "Enviando..." : "Enviar"}{" "}
                {/* Muestra el estado de carga */}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
