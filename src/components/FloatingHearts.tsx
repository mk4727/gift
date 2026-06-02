import { Heart } from "lucide-react";
import { useMemo } from "react";

export const FloatingHearts = ({ count = 14 }: { count?: number }) => {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 15,
        size: 12 + Math.random() * 24,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
      {hearts.map((h) => (
        <Heart
          key={h.id}
          className="absolute fill-primary/40 text-primary/40"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animation: `float-heart ${h.duration}s linear ${h.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};
