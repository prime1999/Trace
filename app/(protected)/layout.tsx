import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-black/50 font-sans">
            Loading workspace...
          </div>
        }
      >
        {children}
      </Suspense>
    </main>
  );
}
