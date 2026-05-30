"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowLeft, MessageCircle, Phone, Mail, MapPin,
  Clock, Send, CheckCircle, RefreshCcw, Truck, RotateCcw, Package,
} from "lucide-react";

const SUBJECTS = [
  "Ma commande",
  "Livraison",
  "Retour / Remboursement",
  "Paiement",
  "Produit / Taille",
  "Autre",
];

const CHANNELS = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+225 00 00 00 00 00",
    desc: "Réponse en moins de 2h",
    bg: "#d8f5c0",
    href: "https://wa.me/2250777063646",
    cta: "Écrire sur WhatsApp",
    ctaBg: "#25D366",
  },
  {
    Icon: Phone,
    label: "Téléphone",
    value: "+225 00 00 00 00 00",
    desc: "Lun–Sam, 8h–19h",
    bg: "#99C5FF",
    href: "tel:+2250777063646",
    cta: "Appeler",
    ctaBg: "#6D86DD",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "info@kidsland.africa",
    desc: "Réponse sous 24h",
    bg: "#fff3bb",
    href: "mailto:info@kidsland.africa",
    cta: "Envoyer un email",
    ctaBg: "#000000",
  },
];

async function sendMessage(data: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}) {
  await new Promise((r) => setTimeout(r, 900));
  console.log("Contact form submission:", data);
  return { ok: true };
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await sendMessage({ name, phone, email, subject, message });
      setSent(true);
    });
  }

  function reset() {
    setName(""); setPhone(""); setEmail("");
    setSubject(SUBJECTS[0]); setMessage(""); setSent(false);
  }

  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#F6E5E5]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3"><MessageCircle size={48} className="text-gray-700" /></div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">Nous contacter</h1>
              <p className="text-sm text-gray-700">
                Une question, un problème ou un conseil sur une taille ? On est là.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/60 rounded-2xl px-6 py-4">
              <Clock size={20} className="text-gray-600 shrink-0" />
              <div>
                <div className="text-base font-bold tracking-tight">Lun – Sam</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
                  8h – 19h
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shop py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT — channels + info */}
          <div className="space-y-8">
            {/* Channel cards */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Choisissez votre canal
              </h2>
              <div className="space-y-4">
                {CHANNELS.map((ch) => (
                  <div
                    key={ch.label}
                    className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex items-stretch"
                  >
                    {/* Color stripe */}
                    <div
                      className="w-1.5 shrink-0"
                      style={{ backgroundColor: ch.ctaBg === "#000000" ? "#FFD21F" : ch.ctaBg }}
                    />
                    <div className="flex items-center gap-4 px-5 py-4 flex-1">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: ch.bg }}
                      >
                        <ch.Icon size={20} className="text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {ch.label}
                        </div>
                        <div className="text-[14px] font-semibold truncate">{ch.value}</div>
                        <div className="text-[12px] text-gray-400 mt-0.5">{ch.desc}</div>
                      </div>
                      <a
                        href={ch.href}
                        className="shrink-0 px-4 py-2 rounded-full text-white text-[12px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform whitespace-nowrap"
                        style={{ backgroundColor: ch.ctaBg }}
                      >
                        {ch.cta}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Horaires */}
            <div className="rounded-2xl bg-[#FDF8F8] border border-gray-100 p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                Horaires du service client
              </h3>
              <div className="space-y-2">
                {[
                  { days: "Lundi – Vendredi", hours: "8h00 – 19h00" },
                  { days: "Samedi",           hours: "9h00 – 17h00" },
                  { days: "Dimanche",         hours: "Fermé" },
                ].map(({ days, hours }) => (
                  <div key={days} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{days}</span>
                    <span className={`font-semibold ${hours === "Fermé" ? "text-gray-400" : "text-black"}`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Adresse */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F6E5E5] flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gray-700" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Notre boutique
                  </div>
                  <div className="text-[14px] font-semibold">Abidjan, Côte d&apos;Ivoire</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">
                    Adresse complète disponible sur commande
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Aide rapide
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { Icon: Package,   label: "Suivre ma commande",  href: "/orders/track"   },
                  { Icon: Truck,     label: "Infos livraison",      href: "/help/shipping"  },
                  { Icon: RotateCcw, label: "Politique de retours", href: "/help/returns"   },
                ].map(({ Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all text-[13px] font-medium text-gray-700 hover:text-black"
                  >
                    <Icon size={15} className="text-gray-400 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Envoyer un message
            </h2>

            {sent ? (
              <div className="rounded-2xl bg-[#d8f5c0] border border-green-100 p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Merci {name ? name.split(" ")[0] : ""}, nous avons bien reçu votre message.
                  Notre équipe vous répondra dans les meilleurs délais.
                </p>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
                >
                  <RefreshCcw size={14} /> Nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      Nom complet <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07 00 00 00 00"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Sujet <span className="text-brand-orange">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSubject(s)}
                        className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-colors ${
                          subject === s
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Message <span className="text-brand-orange">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Décrivez votre demande en détail…"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300 resize-none"
                  />
                  <div className="text-[11px] text-gray-400 mt-1 text-right">
                    {message.length} caractère{message.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-black text-white py-4 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <RefreshCcw size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {isPending ? "Envoi en cours…" : "Envoyer le message"}
                </button>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  Réponse garantie sous 24h. Pour une urgence, privilégiez{" "}
                  <a href="https://wa.me/2250777063646" className="text-brand-orange font-medium hover:underline">
                    WhatsApp
                  </a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
