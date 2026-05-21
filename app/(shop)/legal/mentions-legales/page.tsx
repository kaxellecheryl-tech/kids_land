import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Kids Land",
  robots: { index: true, follow: true },
};

const UPDATED = "21 mai 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-2 text-[14px] text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-gray-50">
      <span className="text-[13px] font-semibold text-gray-500 w-44 shrink-0">{label}</span>
      <span className="text-[13px] text-gray-700">{value}</span>
    </div>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="container-shop max-w-3xl py-16">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange mb-2">Légal</p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Mentions légales</h1>
        <p className="text-sm text-gray-400">Dernière mise à jour : {UPDATED}</p>
      </div>

      <Section title="1. Éditeur du site">
        <Row label="Dénomination" value="Kids Land" />
        <Row label="Forme juridique" value="[FORME JURIDIQUE À COMPLÉTER]" />
        <Row label="Capital social" value="[CAPITAL À COMPLÉTER]" />
        <Row label="Siège social" value="[ADRESSE DU SIÈGE À COMPLÉTER], Abidjan, Côte d'Ivoire" />
        <Row label="Numéro RCCM" value="[NUMÉRO RCCM À COMPLÉTER]" />
        <Row label="Numéro contribuable" value="[NUMÉRO À COMPLÉTER]" />
        <Row label="Responsable de publication" value="[NOM DU RESPONSABLE À COMPLÉTER]" />
        <Row label="Email de contact" value="info@kidsland.africa" />
        <Row label="Téléphone" value="[NUMÉRO DE TÉLÉPHONE À COMPLÉTER]" />
      </Section>

      <Section title="2. Hébergement">
        <Row label="Hébergeur" value="Vercel Inc." />
        <Row label="Adresse" value="340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis" />
        <Row label="Site web" value="vercel.com" />
        <p className="mt-2">
          La base de données est hébergée par <strong>Supabase</strong> (région EU — Frankfurt, Allemagne).
        </p>
      </Section>

      <Section title="3. Propriété intellectuelle">
        <p>
          L&apos;ensemble du contenu de ce site (textes, photographies, images, logos, noms de marques)
          est la propriété exclusive de Kids Land ou de ses partenaires, et est protégé par les
          dispositions du Code de la Propriété Intellectuelle applicable en Côte d&apos;Ivoire.
        </p>
        <p>
          Toute reproduction, représentation, modification ou exploitation, totale ou partielle,
          du contenu de ce site, par quelque procédé que ce soit, sans autorisation préalable et
          écrite de Kids Land, est strictement interdite.
        </p>
      </Section>

      <Section title="4. Cookies">
        <p>
          Ce site utilise des cookies strictement nécessaires à son bon fonctionnement (gestion
          de session, panier, préférences). Aucun cookie publicitaire ou de traçage tiers n&apos;est
          déposé sans votre consentement.
        </p>
        <p>
          Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur,
          ce qui peut affecter certaines fonctionnalités du site.
        </p>
      </Section>

      <Section title="5. Limitation de responsabilité">
        <p>
          Kids Land s&apos;efforce d&apos;assurer l&apos;exactitude des informations publiées sur ce site
          mais ne peut en garantir l&apos;exhaustivité. Kids Land ne saurait être tenu responsable
          des erreurs ou omissions, ni des dommages directs ou indirects résultant de l&apos;utilisation
          de ce site.
        </p>
        <p>
          Kids Land se réserve le droit de modifier le contenu de ce site à tout moment et sans préavis.
        </p>
      </Section>

      <Section title="6. Droit applicable">
        <p>
          Le présent site et ses mentions légales sont soumis au droit ivoirien. Tout litige
          relatif à l&apos;utilisation de ce site sera soumis à la compétence des tribunaux d&apos;Abidjan.
        </p>
      </Section>
    </div>
  );
}
