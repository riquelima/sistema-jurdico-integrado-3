"use client";

import { useEffect } from "react";

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
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <h2 className="text-xl font-semibold">Algo deu errado</h2>
          <p className="text-sm text-muted-foreground mt-2">Tente novamente ou volte ao dashboard.</p>
          <button className="mt-4 h-10 px-4 rounded-md border" onClick={() => reset()}>
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
