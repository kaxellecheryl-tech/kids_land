import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Kids Land",
  robots: { index: true, follow: true },
};

const UPDATED = "21 mai 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-black mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-[14px] text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <div className="container-shop max-w-3xl py-16">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange mb-2">Légal</p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Politique de confidentialité</h1>
        <p className="text-sm text-gray-400">Dernière mise à jour : {UPDATED}</p>
      </div>

      <Section title="1. Responsable du traitement">
        <p>
          Kids Land, dont le siège social est situé à Abidjan, Côte d&apos;Ivoire, est responsable
          du traitement de vos données personnelles collectées via le site <strong>www.kidsland.africa</strong>.
        </p>
        <p>
          Pour toute question relative à vos données, contactez-nous à :{" "}
          <a href="mailto:info@kidsland.africa" className="text-brand-orange hover:underline">
            info@kidsland.africa
          </a>
        </p>
      </Section>

      <Section title="2. Données collectées">
        <p>Lors de votre utilisation du site, nous collectons les données suivantes :</p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-100">Données</th>
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-100">Finalité</th>
                <th className="text-left p-3 font-semibold text-gray-700 border border-gray-100">Base légale</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Nom, email, téléphone", "Création de compte, gestion commandes", "Exécution du contrat"],
                ["Adresse de livraison", "Livraison des commandes", "Exécution du contrat"],
                ["Historique des commandes", "Suivi, retours, support client", "Exécution du contrat"],
                ["Contenu du panier et favoris", "Amélioration de l'expérience", "Intérêt légitime"],
                ["Email (si consentement marketing)", "Promotions, nouveautés, newsletters", "Consentement"],
                ["Données de connexion (IP, navigateur)", "Sécurité, lutte contre la fraude", "Intérêt légitime"],
              ].map(([data, purpose, basis]) => (
                <tr key={data} className="border-b border-gray-50">
                  <td className="p-3 border border-gray-100 font-medium text-gray-800">{data}</td>
                  <td className="p-3 border border-gray-100">{purpose}</td>
                  <td className="p-3 border border-gray-100">{basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. Durée de conservation">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Données de compte</strong> : conservées pendant toute la durée du compte, puis 3 ans après la dernière activité</li>
          <li><strong>Données de commandes</strong> : 10 ans (obligation légale comptable)</li>
          <li><strong>Données marketing</strong> : jusqu&apos;au retrait du consentement ou 3 ans sans activité</li>
          <li><strong>Données de connexion</strong> : 12 mois</li>
        </ul>
      </Section>

      <Section title="4. Partage des données">
        <p>Vos données ne sont jamais vendues. Elles peuvent être transmises aux sous-traitants suivants :</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Supabase</strong> — hébergement de la base de données (EU)</li>
          <li><strong>Vercel</strong> — hébergement du site web (USA)</li>
          <li><strong>Wave</strong> — traitement des paiements</li>
          <li><strong>Brevo</strong> — envoi d&apos;emails transactionnels et marketing</li>
        </ul>
        <p>
          Ces sous-traitants s&apos;engagent à traiter vos données conformément aux lois applicables
          en matière de protection des données.
        </p>
      </Section>

      <Section title="5. Vos droits">
        <p>Vous disposez des droits suivants sur vos données personnelles :</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
          <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
          <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de votre compte et de vos données</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
          <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement à des fins marketing</li>
          <li><strong>Retrait du consentement</strong> : à tout moment pour les communications marketing</li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez-nous à{" "}
          <a href="mailto:info@kidsland.africa" className="text-brand-orange hover:underline">
            info@kidsland.africa
          </a>. Nous répondrons dans un délai de 30 jours.
        </p>
      </Section>

      <Section title="6. Cookies">
        <p>
          Le site utilise des cookies pour son fonctionnement (session utilisateur, panier, favoris).
          Ces cookies sont strictement nécessaires et ne requièrent pas votre consentement.
        </p>
        <p>
          Aucun cookie de traçage publicitaire tiers n&apos;est déposé sans votre accord explicite.
          Vous pouvez gérer vos préférences cookies via les paramètres de votre navigateur.
        </p>
      </Section>

      <Section title="7. Sécurité">
        <p>
          Kids Land met en œuvre des mesures techniques appropriées pour protéger vos données :
          chiffrement HTTPS, authentification sécurisée via Supabase Auth, accès limité aux données.
        </p>
        <p>
          En cas de violation de données susceptible d&apos;affecter vos droits, nous vous en informerons
          dans les meilleurs délais.
        </p>
      </Section>

      <Section title="8. Modifications">
        <p>
          Cette politique peut être mise à jour. La version applicable est toujours celle affichée
          sur cette page avec sa date de dernière mise à jour. Toute modification substantielle
          vous sera notifiée par email.
        </p>
        <p>
          Pour plus d&apos;informations sur nos pratiques commerciales, consultez nos{" "}
          <Link href="/legal/cgv" className="text-brand-orange hover:underline">
            Conditions Générales de Vente
          </Link>.
        </p>
      </Section>
    </div>
  );
}
