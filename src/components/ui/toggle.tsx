"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:data-[state=on]:bg-slate-700 dark:data-[state=on]:text-slate-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-slate-300 focus-visible:ring-slate-300/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-slate-900",
        outline:
          "border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-xs hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
