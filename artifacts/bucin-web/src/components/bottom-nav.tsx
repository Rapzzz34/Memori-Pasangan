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
        background: "rgba(6,0,12,0.92)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderTop: "1px solid rgba(255,30,140,0.18)",
        boxShadow: "0 -4px 32px rgba(255,20,147,0.10)",
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
              style={{ color: active ? "hsl(330,100%,62%)" : "rgba(255,255,255,0.22)" }}
            >
              <div
                className="relative flex items-center justify-center"
                style={active ? {
                  background: "rgba(255,20,147,0.15)",
                  borderRadius: "10px",
                  padding: "4px 8px",
                  boxShadow: "0 0 12px rgba(255,20,147,0.25)",
                } : { padding: "4px 8px" }}
              >
                <Icon
                  className="w-5 h-5 transition-all"
                  style={{
                    fill: active ? "hsl(330,100%,62%)" : "transparent",
                    stroke: active ? "hsl(330,100%,62%)" : "rgba(255,255,255,0.22)",
                    strokeWidth: 1.5,
                    filter: active ? "drop-shadow(0 0 6px rgba(255,20,147,0.7))" : "none",
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
