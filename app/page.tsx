import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import Link from "next/link";
import { Suspense } from "react";
import Product from "@/components/Product";
import Integration from "@/components/Integration";
import Documentation from "@/components/Documentation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center sticky top-0 backdrop-blur-3xl z-50">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href={"/"}>
              <Image src={logo} alt="Logo" width={32} height={32} />
            </Link>
            <div className="flex gap-5 items-center font-mono text-sm">
              <Link
                href="#product"
                className="duration-500 transition hover:text-black/70"
              >
                Product
              </Link>
              <Link
                href="#useCase"
                className="duration-500 transition hover:text-black/70"
              >
                Use Case
              </Link>

              <Link
                href="#docs"
                className="duration-500 transition hover:text-black/70"
              >
                Docs
              </Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>

        <Hero />
        <Product />
        <Integration />
        <Documentation />
        <Footer />
      </div>
    </main>
  );
}
