"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import { cn } from "@/lib/cn";

const PANEL_POINTS = [
  "AI writes your scripts, titles & hooks",
  "Thumbnails & scheduling, handled",
  "A clear path from zero to consistent",
  "Free to start — no card needed",
];

export default function SignupPage() {
  const router = useRouter();
  const [pro, setPro] = useState(false);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Read ?plan=pro without pulling in useSearchParams (keeps the page static).
  useEffect(() => {
    setPro(new URLSearchParams(window.location.search).get("plan") === "pro");
  }, []);

  // NOTE: front-end only for now — real accounts arrive once Supabase is wired.
  // For the moment, "signing up" drops you into onboarding (the local app).
  const proceed = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => router.push("/onboarding"), 750);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    proceed();
  };

  const isSignup = mode === "signup";

  return (
    <div className="grid min-h-dvh bg-paper md:grid-cols-2">
      {/* Left brand panel */}
      <aside className="relative hidden animate-slide-in-left overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white md:flex md:flex-col md:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 animate-float rounded-full bg-white/5 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />

        <Logo
          className="relative [&_span]:text-white"
          markClassName="ring-1 ring-white/20"
        />

        <div className="relative max-w-sm">
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
            Your channel, on autopilot.
          </h2>
          <ul className="mt-6 space-y-3">
            {PANEL_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/90">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">
          Couch-to-5K, but for YouTube.
        </p>
      </aside>

      {/* Right form panel */}
      <main className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm animate-scale-in">
          <a
            href="/welcome"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </a>

          <div className="md:hidden">
            <LogoMark className="h-10 w-10" />
          </div>

          {pro && (
            <span className="mt-4 inline-flex animate-fade-up items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              <Sparkles className="h-3.5 w-3.5" /> Starting your 3-day Pro trial
            </span>
          )}

          <h1 className="mt-4 animate-fade-up font-display text-3xl font-extrabold tracking-tight">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p
            className="mt-1.5 animate-fade-up text-sm text-muted"
            style={{ animationDelay: "60ms" }}
          >
            {isSignup
              ? "Start automating your channel in under a minute."
              : "Log in to pick up where you left off."}
          </p>

          {/* Google (mock) */}
          <button
            type="button"
            onClick={proceed}
            disabled={loading}
            className="mt-7 flex w-full animate-fade-up items-center justify-center gap-2.5 rounded-2xl border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-ink shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:pointer-events-none disabled:opacity-60"
            style={{ animationDelay: "120ms" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
              </>
            ) : (
              <>
                <GoogleMark /> Continue with Google
              </>
            )}
          </button>

          <div
            className="my-5 flex animate-fade-up items-center gap-3 text-xs font-medium text-muted"
            style={{ animationDelay: "150ms" }}
          >
            <span className="h-px flex-1 bg-hairline" />
            or
            <span className="h-px flex-1 bg-hairline" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <Field
              label="Email"
              delay={180}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Field
              label="Password"
              delay={210}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={isSignup ? "Create a password" : "Your password"}
            />

            <button
              type="submit"
              disabled={loading}
              className="!mt-5 inline-flex w-full animate-fade-up items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-glow active:scale-[0.99] disabled:pointer-events-none disabled:opacity-80"
              style={{ animationDelay: "240ms" }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignup ? "Creating your account…" : "Logging you in…"}
                </>
              ) : (
                <>
                  {isSignup
                    ? pro
                      ? "Start free trial"
                      : "Create free account"
                    : "Log in"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p
            className="mt-6 animate-fade-up text-center text-sm text-muted"
            style={{ animationDelay: "280ms" }}
          >
            {isSignup ? "Already have an account?" : "New to Frame?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="font-semibold text-brand-700 hover:underline"
            >
              {isSignup ? "Log in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  delay,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  delay: number;
}) {
  return (
    <label
      className="block animate-fade-up space-y-1.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "email"}
        className={cn(
          "w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors",
          "focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500",
        )}
      />
    </label>
  );
}

/** Inline Google "G" so we don't depend on a brand icon (dropped in this lucide). */
function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44a20 20 0 0 0 19.6-23.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
