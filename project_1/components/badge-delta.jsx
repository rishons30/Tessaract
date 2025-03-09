import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export function BadgeDelta({ value, className }) {
  if (value === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border border-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground",
          className,
        )}
      >
        <Minus className="mr-1 h-3 w-3" />
        {value}%
      </span>
    )
  }

  const isPositive = value > 0

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-semibold",
        isPositive
          ? "border-green-500/20 text-green-600 bg-green-500/10"
          : "border-red-500/20 text-red-600 bg-red-500/10",
        className,
      )}
    >
      {isPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

