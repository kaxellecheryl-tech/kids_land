import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-[96px]" />}>
        <Header />
      </Suspense>
      <main className="pt-[96px]">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
