"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/chat");
  };

  return (
    <div className="flex h-screen bg-blue">
      <div className="flex-1 p-8 ml-24 flex flex-col justify-center items-start gap-6">
        <h1 className="text-8xl font-bold text-grey">Conversa con IA</h1>
        <h2 className="text-2xl text-grey">
          Tu asistente virtual siempre disponible.
        </h2>
          <button
            type="submit"
            onClick={handleClick}
            className="bg-yellow text-black py-3 px-6 w-80 rounded font-bold hover:bg-yellow/90 transition duration-300"
          >
            Comienza ahora
          </button>
      </div>

      <div className="flex-1 p-8 flex justify-end items-center overflow-hidden">
        <img
          src="https://www.seguritecnia.es/wp-content/uploads/2022/03/inteligencia-artificial-900x600.jpg"
          alt="Inteligencia Artificial"
          className="rounded-lg shadow-lg -mr-24 object-cover"
        />
      </div>
    </div>
  );
}
