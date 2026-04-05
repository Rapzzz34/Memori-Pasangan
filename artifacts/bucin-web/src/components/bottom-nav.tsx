import { Link, useLocation } from "wouter";
import { Heart, Camera, CheckSquare, Music2, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Heart, label: "Beranda" },
  { href: "/kenangan", icon: Camera, label: "Kenangan" },
  { href: "/impian", icon: CheckSquare, label: "Impian" },
  { href: "/lagu", icon: Music2, label: "Lagu" },
  { href: "/diary", icon: BookOpen, label: "Diary" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="shrink-0"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,150,200,0.25)",
        boxShadow: "0 -4px 24px rgba(255,20,147,0.06)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[52px]"
              style={{ color: active ? "hsl(330,100%,50%)" : "rgba(80,20,80,0.35)" }}
            >
              <div
                className="relative flex items-center justify-center"
                style={active ? {
                  background: "rgba(255,20,147,0.10)",
                  borderRadius: "10px",
                  padding: "4px 8px",
                } : { padding: "4px 8px" }}
              >
                <Icon
                  className="w-5 h-5 transition-all"
                  style={{
                    fill: active ? "hsl(330,100%,50%)" : "transparent",
                    stroke: active ? "hsl(330,100%,50%)" : "rgba(80,20,80,0.35)",
                    strokeWidth: 1.5,
                    filter: active ? "drop-shadow(0 0 6px rgba(255,20,147,0.5))" : "none",
                  }}
                />
              </div>
              <span className="text-[9px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
