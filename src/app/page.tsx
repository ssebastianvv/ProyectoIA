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
        <h1 className="text-8xl font-bold text-grey">Conversa con AgricoIA</h1>
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
          src="https://www.google.com/imgres?q=agricultura&imgurl=https%3A%2F%2Fcloudfront-us-east-1.images.arcpublishing.com%2Felespectador%2F27J7GNALYVER7IIURFTFXENLRI.jpeg&imgrefurl=https%3A%2F%2Fwww.elespectador.com%2Fambiente%2Fpor-que-ha-fracasado-la-agricultura-en-colombia%2F&docid=KpJPprUZB0LWbM&tbnid=ld-8Dh0VyOf9IM&vet=12ahUKEwjW_OaRqqCLAxXfQjABHRnQIzMQM3oECH4QAA..i&w=657&h=438&hcb=2&ved=2ahUKEwjW_OaRqqCLAxXfQjABHRnQIzMQM3oECH4QAA"
          alt="Inteligencia Artificial"
          className="rounded-lg shadow-lg -mr-24 object-cover"
        />
      </div>
    </div>
  );
}
