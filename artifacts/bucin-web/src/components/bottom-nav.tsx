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
      className="shrink-0 border-t border-white/8"
      style={{ background: "rgba(10,15,30,0.96)" }}
    >
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = location === href || (href !== "/" && location.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[52px]"
              style={{
                color: active ? "hsl(330,85%,65%)" : "rgba(255,255,255,0.35)",
              }}
            >
              <Icon
                className="w-5 h-5 transition-all"
                style={{
                  fill: active ? "hsl(330,85%,65%)" : "transparent",
                  stroke: active ? "hsl(330,85%,65%)" : "rgba(255,255,255,0.35)",
                  strokeWidth: 1.5,
                }}
              />
              <span className="text-[9px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
