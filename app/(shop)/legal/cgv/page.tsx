import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Kids Land",
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

export default function CGVPage() {
  return (
    <div className="container-shop max-w-3xl py-16">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange mb-2">Légal</p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Conditions Générales de Vente</h1>
        <p className="text-sm text-gray-400">Dernière mise à jour : {UPDATED}</p>
      </div>

      <Section title="1. Objet et champ d'application">
        <p>
          Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les relations contractuelles
          entre la société Kids Land (ci-après « Kids Land », « nous ») et toute personne physique effectuant
          un achat sur le site <strong>www.kidsland.africa</strong> (ci-après « le Site »).
        </p>
        <p>
          Toute commande passée sur le Site implique l&apos;acceptation pleine et entière des présentes CGV.
          Kids Land se réserve le droit de modifier ces conditions à tout moment ; les CGV applicables sont
          celles en vigueur au jour de la commande.
        </p>
      </Section>

      <Section title="2. Produits et prix">
        <p>
          Les produits proposés à la vente sont ceux présentés sur le Site au moment de la consultation.
          Kids Land s&apos;efforce d&apos;assurer l&apos;exactitude des informations (descriptions, photos, prix),
          mais ne peut garantir leur parfaite exhaustivité.
        </p>
        <p>
          Les prix sont indiqués en Francs CFA (FCFA), toutes taxes comprises. Kids Land se réserve le droit
          de modifier ses prix à tout moment, étant entendu que le prix applicable est celui affiché au moment
          de la validation de la commande.
        </p>
        <p>
          En cas d&apos;indisponibilité d&apos;un produit après validation de votre commande, Kids Land vous en
          informera par email dans les meilleurs délais et procédera au remboursement intégral.
        </p>
      </Section>

      <Section title="3. Commande">
        <p>
          Pour passer commande, le client doit créer un compte ou se connecter à son espace personnel,
          ajouter les articles souhaités au panier, renseigner son adresse de livraison, puis procéder
          au paiement.
        </p>
        <p>
          La commande est confirmée après réception du paiement. Un email de confirmation récapitulant
          le détail de la commande est envoyé à l&apos;adresse email fournie lors de l&apos;inscription.
        </p>
        <p>
          Kids Land se réserve le droit de refuser ou d&apos;annuler toute commande en cas de suspicion de fraude,
          de fausse information ou de litige antérieur avec le client.
        </p>
      </Section>

      <Section title="4. Paiement">
        <p>
          Le paiement s&apos;effectue via WhatsApp, après validation de la commande sur le Site.
          Les moyens de paiement acceptés sont : <strong>Wave</strong>, <strong>Orange Money</strong>,{" "}
          <strong>MTN Momo</strong> et <strong>Djamo</strong>. Le montant est réglé directement
          entre le client et l&apos;équipe Kids Land avant l&apos;expédition de la commande.
        </p>
        <p>
          Le Site ne stocke aucune donnée bancaire ou de paiement.
        </p>
      </Section>

      <Section title="5. Livraison">
        <p>
          Les commandes sont livrées à l&apos;adresse indiquée lors de la commande. Kids Land livre
          actuellement en Côte d&apos;Ivoire.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Abidjan</strong> : 24 à 48 heures ouvrées — 1 500 FCFA (offerte dès 25 000 FCFA)</li>
          <li><strong>Intérieur du pays</strong> : 2 à 4 jours ouvrés — 3 500 FCFA</li>
        </ul>
        <p>
          Ces délais sont indicatifs et peuvent varier selon les conditions locales. Kids Land ne saurait
          être tenu responsable des retards imputables à des tiers (transporteurs, événements de force majeure).
        </p>
        <p>
          Pour toute question relative à la livraison, consultez notre{" "}
          <Link href="/help/shipping" className="text-brand-orange hover:underline">page dédiée</Link>.
        </p>
      </Section>

      <Section title="6. Retours et remboursements">
        <p>
          Vous disposez d&apos;un délai de <strong>30 jours</strong> à compter de la réception de votre commande
          pour nous retourner un article, sans avoir à justifier votre décision.
        </p>
        <p>
          Les articles retournés doivent être dans leur état d&apos;origine : non portés, non lavés, avec
          étiquettes. Les frais de retour sont pris en charge par Kids Land.
        </p>
        <p>
          Le remboursement est effectué dans un délai de 5 à 10 jours ouvrés après réception et vérification
          du retour, par le même moyen de paiement que celui utilisé lors de la commande.
        </p>
        <p>
          Consultez notre{" "}
          <Link href="/help/returns" className="text-brand-orange hover:underline">politique de retour complète</Link>{" "}
          pour plus de détails.
        </p>
      </Section>

      <Section title="7. Responsabilité">
        <p>
          Kids Land ne saurait être tenu responsable des dommages indirects résultant de l&apos;utilisation
          du Site ou des produits achetés. La responsabilité de Kids Land est limitée au montant de
          la commande concernée.
        </p>
        <p>
          Kids Land ne garantit pas que le Site sera exempt d&apos;interruptions, d&apos;erreurs ou de virus.
          Il appartient au client de prendre toutes les mesures appropriées pour protéger ses données.
        </p>
      </Section>

      <Section title="8. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du Site (textes, images, logos, graphismes) est la propriété exclusive
          de Kids Land et est protégé par les lois applicables en matière de propriété intellectuelle.
          Toute reproduction ou utilisation sans autorisation préalable est interdite.
        </p>
      </Section>

      <Section title="9. Données personnelles">
        <p>
          Les données collectées lors de vos achats sont traitées conformément à notre{" "}
          <Link href="/legal/confidentialite" className="text-brand-orange hover:underline">
            Politique de Confidentialité
          </Link>.
        </p>
      </Section>

      <Section title="10. Droit applicable et litiges">
        <p>
          Les présentes CGV sont soumises au droit ivoirien. En cas de litige, une solution amiable
          sera recherchée en priorité. À défaut, les tribunaux compétents de la juridiction d&apos;Abidjan
          seront saisis.
        </p>
        <p>
          Pour toute réclamation, contactez-nous à{" "}
          <a href="mailto:info@kidsland.africa" className="text-brand-orange hover:underline">
            info@kidsland.africa
          </a>.
        </p>
      </Section>
    </div>
  );
}
