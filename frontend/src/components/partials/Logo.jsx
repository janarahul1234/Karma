import { Shell } from "lucide-react";

import { cn } from "@/lib/utils";

export default function Logo({ className }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Shell size={32} className="text-green-500" />
      <span className="text-xl font-semibold">Karma</span>
    </div>
  );
}
