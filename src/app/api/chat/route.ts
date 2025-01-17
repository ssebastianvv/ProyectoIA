import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "El mensaje es obligatorio" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0]?.message?.content || "Sin respuesta.";

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al conectar con OpenAI:", error.message);
    } else {
      console.error("Error desconocido:", error);
    }

    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
