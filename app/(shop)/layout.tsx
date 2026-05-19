import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AnnouncementBar } from "@/components/shop/AnnouncementBar";
import { getActiveFeaturedCoupon } from "@/app/actions/coupon";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const coupon = await getActiveFeaturedCoupon();

  const label = coupon
    ? coupon.discountType === "PERCENTAGE"
      ? `−${coupon.discountValue}% sur votre commande`
      : coupon.discountType === "FIXED_AMOUNT"
      ? `−${coupon.discountValue} F sur votre commande`
      : "Livraison offerte"
    : null;

  return (
    <>
      {coupon && label && (
        <AnnouncementBar code={coupon.code} label={label} />
      )}
      <Suspense fallback={<div className="h-[96px]" />}>
        <Header />
      </Suspense>
      {/* pt = header (96px) + barre d'annonce si présente (var CSS, 0px par défaut) */}
      <main style={{ paddingTop: "calc(96px + var(--announcement-h, 0px))" }}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
