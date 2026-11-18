import { SignInButton, SignUpButton } from "@clerk/nextjs";
import "./global.css";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#694129] flex items-center justify-center p-5">
      <div className="w-full max-w-md text-center">
        <p className="text-sm tracking-[0.7em] font-sans uppercase text-[#ffffff]">
          Welcome to
        </p>

        <h1 className="animate-fade-up font-sans mt-2 text-6xl bg-linear-to-bl from-[#ffffff] to-[#eed70a] bg-clip-text text-transparent">
          Pinecone Coffee House
        </h1>

        <p className="font-script text-2xl mt-5 text-[#c7e3fc] animate-typewriter">
          Freshly roasted specially beans from ROC.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <SignInButton mode="modal">
            <button className="w-full rounded-full bg-[#422D24] py-4 text-white hover:bg-[#ffffff] hover:text-[#604536]">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="w-full rounded-full border border-[#ffffff] py-4 text-[#ffffff] hover:text-[#604536] hover:bg-[#E9DED0]">
              Create Account
            </button>
          </SignUpButton>
        </div>
      </div>
    </main>
  );
}
