import { Layout } from "@/components/layout";
import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <Layout hideNav>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <Heart className="w-10 h-10 text-primary/20" />
        <p className="text-white/40 text-sm">Halaman tidak ditemukan</p>
        <Link href="/" className="text-primary text-xs underline underline-offset-4">Kembali ke beranda</Link>
      </div>
    </Layout>
  );
}
