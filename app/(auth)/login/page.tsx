"use client";

import Link from "next/link";
import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, RefreshCcw, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect."
            : authError.message
        );
        return;
      }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Se connecter</h1>
        <p className="text-[13px] text-gray-500 mb-7">
          Accédez à votre compte pour passer commande et suivre vos livraisons.
        </p>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Email <span className="text-brand-orange">*</span>
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Mot de passe <span className="text-brand-orange">*</span>
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <RefreshCcw size={15} className="animate-spin" />
            ) : (
              <LogIn size={15} />
            )}
            {isPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-[13px] text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <Link
            href={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-black hover:text-brand-orange transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 rounded-2xl bg-white animate-pulse" />}>
      <LoginForm />
    </Suspense>
  );
}
