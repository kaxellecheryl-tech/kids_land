"use client";

import Link from "next/link";
import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, UserPlus, RefreshCcw, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createUserRecord } from "@/app/actions/auth";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    startTransition(async () => {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) {
        setError(
          signUpError.message === "User already registered"
            ? "Un compte existe déjà avec cet email."
            : signUpError.message
        );
        return;
      }
      if (!data.user) {
        setError("Erreur lors de la création du compte. Réessayez.");
        return;
      }
      await createUserRecord({ id: data.user.id, email, fullName, phone });
      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Créer un compte</h1>
        <p className="text-[13px] text-gray-500 mb-7">
          Rejoignez Kids Land pour commander et suivre vos livraisons facilement.
        </p>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Nom complet <span className="text-brand-orange">*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Kouassi Ama"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Téléphone <span className="text-brand-orange">*</span>
              </label>
              <input
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07 00 00 00 00"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
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
            <p className="text-[11px] text-gray-400 mt-1">Au moins 8 caractères.</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <RefreshCcw size={15} className="animate-spin" />
            ) : (
              <UserPlus size={15} />
            )}
            {isPending ? "Création du compte…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-[13px] text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link
            href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-black hover:text-brand-orange transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-[520px] rounded-2xl bg-white animate-pulse" />}>
      <RegisterForm />
    </Suspense>
  );
}
