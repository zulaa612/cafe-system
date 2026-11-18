import { SignInButton, SignUpButton } from "@clerk/nextjs";
import "./global.css";

function CoffeeBean({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="32" cy="42" rx="26" ry="38" fill="url(#beanGradient)" />
      {/*Coffeenii urnii goliin dolgiontoi zuraas hesgiin path*/}
      <path
        d="M31 6C23 24 41 60 32 78"
        stroke="#1A0E08"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path />

      {/*Highlight */}
      <path
        d="M17 20C13 32 13 50 17 62"
        stroke="#B47B80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <defs>
        <linearGradient
          id="beanGradeint"
          x1="8"
          y1="10"
          x2="56"
          y2="74"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F432A" />
          <stop offset="0.6" stopColor="#fffff" />
          <stop offset="1" stopColor="ffffff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
      <div className="animate-blob-1 pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D97706]/20 blur-[100px]" />
      <div className="animate-blob-2 pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#F59E0B]/15 blur-[110px]" />

      <div className="pointer-ecents-none absolute inset-0 overflow-hidden">
        {/*Zuun deed */}
        <CoffeeBean className="animate-bean-1 absolute top-[8%] left-[8%] md:left-[15%] w-20 md:w-28 opacity-45 -rotate-12" />
        {/*Baruun deed */}
        <CoffeeBean className="animate-bean-2 absolute top-[10%] right-[8%] w-12 md:w-16 opacity-65 rotate-45" />
        {/*Zuun dood */}
        <CoffeeBean className="animate-bean-3 absolute bottom-[12%] left-[6%] md:left-[20%] w-14 md:w-20 opacity-55 rotate-30" />
        {/**Baruun dood */}
        <CoffeeBean className="animate-bean-1 absolute bottom-[8%] right-[8%] md:right-[14%] w-24 md:w-32 opacity-40  rotate-[-35deg]" />
        {/*Dund baigaa 2 ur */}
        <CoffeeBean className="animate-bean-2 absolute top-[45%] left-[4%] md:left-[10%] w-9 md:w-11 opacity-30 blur-[2px] rotate-12" />
        <CoffeeBean className="animate-bean-3 absolute top-[50%] right-[5%] md:right-[11%] w-10 md:w-12 opacity-35 blur-[1px] -rotate-45" />
      </div>
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
