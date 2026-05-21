"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

// Remplace le root layout en cas d'erreur critique — doit inclure <html> et <body>
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#FAFAFA" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 400 }}>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: "#F0F0F0",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              :(
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: "#111" }}>
              Le site a rencontré un problème
            </h1>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 32 }}>
              Une erreur critique est survenue. Rechargez la page ou revenez dans quelques instants.
            </p>
            {error.digest && (
              <p style={{ fontSize: 11, fontFamily: "monospace", color: "#CCC", marginBottom: 24 }}>
                Réf : {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#000",
                color: "#fff",
                border: "none",
                padding: "14px 32px",
                borderRadius: 50,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                cursor: "pointer",
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
