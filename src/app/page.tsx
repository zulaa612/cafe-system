import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./global.css";
import Link from "next/link";
import { Suspense, useId } from "react";

type RoastLevel = "light" | "medium" | "dark";
interface CoffeeBeanProps {
  className?: string;
  roast?: RoastLevel;
}
const ROAST_STYLES: Record<
  RoastLevel,
  {
    stop0: string;
    stopMid: string;
    stopEnd: string;
    crease: string;
    highlight: string;
  }
> = {
  light: {
    stop0: "#7A492E",
    stopMid: "#542F1B",
    stopEnd: "#331A0D",
    crease: "#1E0E06",
    highlight: "#B87E5B",
  },
  medium: {
    stop0: "#4E2B18",
    stopMid: "#2E170C",
    stopEnd: "#180B05",
    crease: "#0D0502",
    highlight: "#8A5437",
  },
  dark: {
    stop0: "#2B160C",
    stopMid: "#190C06",
    stopEnd: "#0B0502",
    crease: "#050201",
    highlight: "#593522",
  },
};

export function CoffeeBean({ className, roast = "medium" }: CoffeeBeanProps) {
  const palette = ROAST_STYLES[roast];
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 64 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="32" cy="42" rx="26" ry="38" fill={`url(#${gradientId})`} />
      {/*Coffeenii urnii goliin dolgiontoi zuraas hesgiin path*/}
      <path
        d="M31 6C23 24 41 60 32 78"
        stroke={palette.crease}
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/*Highlight */}
      <path
        d="M17 20C13 32 13 50 17 62"
        stroke={palette.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="8"
          y1="10"
          x2="56"
          y2="74"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={palette.stop0} />
          <stop offset="0.6" stopColor={palette.stopMid} />
          <stop offset="1" stopColor={palette.stopEnd} />
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

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/*Zuun tal*/}
        <CoffeeBean
          roast="light"
          className="animate-bean-1 absolute top-[8%] left-[12%] w-16 opacity-100 -rotate-12"
        />

        <CoffeeBean
          roast="light"
          className="animate-bean-1 absolute top-[43%] left-[2%] w-16 opacity-100 -rotate-12"
        />

        <CoffeeBean
          roast="light"
          className="animate-bean-1 absolute top-[50%] left-[15%] w-24 opacity-100 rotate-40"
        />
        {/*Baruun deed */}
        <CoffeeBean
          roast="medium"
          className="animate-bean-2 absolute top-[5%] right-[8%] w-20 opacity-70 rotate-45"
        />
        {/*Zuun dood */}
        <CoffeeBean
          roast="dark"
          className="animate-bean-3 absolute bottom-[2%] right-[5%] w-24 opacity-55 blur-[px] -rotate-30"
        />
        {/**Baruun dood */}
        <CoffeeBean className="animate-bean-1 absolute top-[80%] left-[5%] w-25 opacity-60 -rotate-45" />
        {/*Dund baigaa 2 ur */}
        <CoffeeBean className="animate-bean-2 absolute top-[42%] right-[3%] w-15 opacity-70 rotate-45" />
        <CoffeeBean className="animate-bean-3 absolute bottom-[34%] right-[12%] w-24 opacity-70 blur-[px] -rotate-30" />
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
