import { Memory } from "@workspace/api-client-react";
import { formatDate } from "@/lib/date-utils";
import { Card, CardContent } from "@/components/ui/card";

interface MemoryCardProps {
  memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover-elevate transition-all duration-300 group bg-card">
      <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={memory.imageUrl}
          alt={memory.title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {memory.memoryDate && (
            <div className="text-white/80 text-xs font-medium tracking-wider uppercase mb-2 drop-shadow-sm">
              {formatDate(memory.memoryDate)}
            </div>
          )}
          <h3 className="font-serif text-2xl font-medium leading-tight mb-2 drop-shadow-md">
            {memory.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-3 drop-shadow-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {memory.caption}
          </p>
        </div>
      </div>
    </Card>
  );
}
