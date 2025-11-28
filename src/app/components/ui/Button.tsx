import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center  !pointer-events-auto !py-6 !px-6 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-custom_blue text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          " text-white border !border-slate-400 border-input bg-transparent hover:bg-accent/10 fill-white outline outline-2 outline-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent/10",
        link: "text-primary underline-offset-4 hover:underline",
        red:
          "bg-custom-dark-red text-white shadow-xs hover:bg-custom_dark_red/90 focus-visible:ring-custom-dark-red/20 dark:focus-visible:ring-custom-dark-red/40 fill-white", // New variant
        lightred:
          "bg-custom_red text-white shadow-xs hover:bg-custom_red/90 focus-visible:ring_custom_red/20 dark:focus-visible:ring_custom_red/40 fill-white", // New variant
        lightblue:
          "bg-lightblue !text-black shadow-xs hover:bg-lightblue/90 focus-visible:ring-lightblue/20 dark:focus-visible:ring-lightblue/40 !fill-custom_dark_blue", // New lightblue variant
        // New Outline variant with custom-dark-red color
        outlineDarkRed:
          "border !border-custom_dark_red bg-transparent text-custom-dark-red hover:bg-custom_dark_red/10 hover:text-custom_dark_red/90 active:bg-custom_dark_red active:text-white active:fill-white focus-visible:ring-bg_dark_red focus-visible:fill-white dark:focus-visible:ring-custom-dark-red/40 fill-custom_dark_red",
        white: "bg-white text-black shadow-xs border border-gray-300 hover:bg-gray-100 fill-black",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
}

export { Button, buttonVariants }