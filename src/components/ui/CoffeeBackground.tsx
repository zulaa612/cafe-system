"use client";

import { useId } from "react";

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
      <path
        d="M31 6C23 24 41 60 32 78"
        stroke={palette.crease}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
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

export function CoffeeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-blob-1 absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#D97706]/20 blur-[100px]" />
      <div className="animate-blob-2 absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#F59E0B]/15 blur-[110px]" />

      <CoffeeBean
        roast="light"
        className="animate-bean-1 absolute top-[8%] left-[12%] w-16 -rotate-12"
      />
      <CoffeeBean
        roast="light"
        className="animate-bean-1 absolute top-[43%] left-[2%] w-16 -rotate-12"
      />
      <CoffeeBean
        roast="light"
        className="animate-bean-1 absolute top-[50%] left-[15%] w-24 rotate-40"
      />
      <CoffeeBean
        roast="medium"
        className="animate-bean-1 absolute top-[80%] left-[5%] w-24 opacity-60 -rotate-45"
      />

      <CoffeeBean
        roast="medium"
        className="animate-bean-2 absolute top-[5%] right-[8%] w-20 opacity-70 rotate-45"
      />
      <CoffeeBean
        roast="medium"
        className="animate-bean-2 absolute top-[42%] right-[3%] w-16 opacity-70 rotate-45"
      />
      <CoffeeBean
        roast="dark"
        className="animate-bean-3 absolute bottom-[34%] right-[12%] w-24 opacity-70 blur-[1px] rotate-[-30deg]"
      />
      <CoffeeBean
        roast="dark"
        className="animate-bean-3 absolute bottom-[2%] right-[5%] w-24 opacity-55 blur-[1px] rotate-[-30deg]"
      />
    </div>
  );
}
