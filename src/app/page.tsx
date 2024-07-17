import { Canvas } from "@/components/Canvas";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between bg-gray-700 overflow-hidden py-4">
      <Canvas />
    </main>
  );
}
