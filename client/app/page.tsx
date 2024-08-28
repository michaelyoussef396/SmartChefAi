import { AuthPage } from "@/components/AuthPage";
import Image from "next/image";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-radial from-[#3F5EFB] via-[#9653B9] to-[#FC446B] p-4">
      <AuthPage />
    </main>
  );
}