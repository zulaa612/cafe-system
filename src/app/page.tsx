import { SignInButton, SignUpButton } from "@clerk/nextjs";

import "./global.css";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
      <div className="animate-blob-1 pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D97706]/20 blur-[100px]" />
      <div className="animate-blob-2 pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#F59E0B]/15 blur-[110px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/4 p-8 md:p-10 text-center backdrop-blur-md shadow-2xl">
        <div className="animate-fade-up mx-auto mb-4 flex flex-col items-center justify-center">
          <div className="flex gap-1.5 mb-1">
            <span className="animate-steam h-3 w-0.5 rounded-full bg-amber-200/60" />
            <span className="animate-steam delay-200 h-4 w-0.5 rounded-full bg-amber-200/60" />
            <span className="animate-steam delay-100 h-3 w-0.5 rounded-full bg-amber-200/60" />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/30 bg-amber-500/10 text-2xl">
            ☕
          </div>
        </div>

        <p className="animate-fade-up delay-100 text-xs md:text-sm tracking-[0.5em] font-sans uppercase text-amber-200/80">
          Welcome to
        </p>

        <h1 className="animate-fade-up delay-200 font-bold font-sans mt-3 text-6xl md:text-6xl leading-tight bg-linear-to-bl from-[#ffffff] to-[#eed70a] bg-clip-text text-transparent">
          Pinecone Coffee House
        </h1>

        <p className="animate-fade-up delay-300 font-script text-2xl md:text-3xl mt-4 text-[#E9DED0]/90">
          Freshly roasted specially beans from ROC.
        </p>

        <div className="animate-fade-up delay-300 mx-auto my-6 h-px w-24 bg-linear-to-r from-transparent via-amber-400/50 to-transparent" />

        <div className="animate-fade-up delay-400 flex flex-col gap-5">
          <SignInButton mode="modal">
            <button className="group relative w-full overflow-hidden rounded-full bg-linear-to-r from-[#a55f09] to-[#ffb55a] py-4 font-medium text-white shadow-lg shadow-amber-950/50 hover:scale-[1.02] hover:shadow-amber-200 active:scale-[0.98]">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="w-full rounded-full border-2 border-[#ffffff]/30 bg-[#ffffff]/7 py-4 font-medium text-[#F5EFE6] backdrop-blur-sm hover:scale-[1.02] hover:border-amber-200/80 hover:bg-[#ffffff]/10 active:scale-[0.98]">
              Create Account
            </button>
          </SignUpButton>
        </div>
      </div>
    </main>
  );
}
