"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CoffeeBackground } from "@/components/ui/CoffeeBackground";

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const normalizedPhone = `+976${phone}`;

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError("Please enter your name correctly.");
      return;
    }

    if (!/^\+976\d{8}$/.test(normalizedPhone)) {
      setError("The phone number must be 8 digits.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          phone: normalizedPhone,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error saving data.");
      }

      router.replace("/auth/redirect");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please, try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#351200] text-amber-100">
        <CoffeeBackground />
        <p className="relative z-10">Loading...</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] p-5 text-white">
        <CoffeeBackground />
        <div className="relative z-10 text-center">
          <p>Please sign in to your account first.</p>

          <Link href="/" className="mt-4 inline-block text-amber-300 underline">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#351200] via-[#c57a4f] to-[#2b1101] flex items-center justify-center p-5">
      <CoffeeBackground />
      {/*Card sc*/}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/4 p-8 md:p-10 text-center backdrop-blur-md shadow-2xl">
        {/*Logo*/}
        <div className="mb-5 flex flex-col  items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/30 bg-amber-500/10 text-2xl">
            ☕
          </div>

          <p className="animate-fade-up delay-100 text-xs md:text-sm tracking-[0.5em] font-sans uppercase text-amber-200/80">
            Welcome to
          </p>

          <h1 className="animate-fade-up delay-200 font-bold font-sans mt-3 text-6xl md:text-6xl leading-tight bg-linear-to-bl from-[#ffffff] to-[#eed70a] bg-clip-text text-transparent">
            Pinecone Coffee House
          </h1>
        </div>

        <div className="mx-auto my-6 h-px w-24 bg-linear-to-r from-transparent via-amber-400 to-transparent" />

        {/*Form sc*/}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/*Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#F5E4CA]"
            >
              Your Name
            </label>

            <input
              id="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user?.firstName ?? "Enter your name"}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 placeholder: text-white/40 focus:border-amber-300 focus:outline-none"
            />
          </div>

          {/*Phone*/}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-[#F5E4CA]"
            >
              Phone Number
            </label>

            <div className="flex overflow-hidden rounded-xl border border-white/20 bg-white/10 focus-within:border-amber-300">
              <span className="flex items-center border-r boder-white/20 px-4 text-amber-200 ">
                +976
              </span>

              <input
                id="phone"
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={8}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))
                }
                placeholder="99115533"
                className="w-full bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
          </div>

          {/*Error*/}
          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          {/*Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-linear-to-r from-[#a55f09] py-4 font-medium text-white shaodw-lg shadow-amber-950/50 transition-all hover:sclae-[1.02] active:sclae-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/40">
          Your coffee journey starts here.
        </p>
      </div>
    </main>
  );
}
