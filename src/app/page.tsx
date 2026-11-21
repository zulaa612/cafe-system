import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./global.css";
import Link from "next/link";
import { Suspense } from "react";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">


      <CoffeeBackground />

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

        <p className="animate-fade-up delay-300 font-sans text-sm md:text-base mt-4 text-[#E9DED0]/90">
          Freshly roasted specialty beans from ROC.
        </p>

        <div className="animate-fade-up delay-300 mx-auto my-6 h-px w-24 bg-linear-to-r from-transparent via-amber-400/50 to-transparent" />

        <div className="animate-fade-up delay-400 flex flex-col gap-5">
          <Suspense>
            <Show when="signed-out">
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
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="w-full rounded-full bg-linear-to-r from-[#a55f09] to-[#ffb55a] py-4 text-center font-medium text-white"
              >
                Go to DashBoard
              </Link>

              <div className="flex items-center justify-center gap-3 text-center">
                <span>My Account</span>
                <UserButton />
              </div>
            </Show>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
