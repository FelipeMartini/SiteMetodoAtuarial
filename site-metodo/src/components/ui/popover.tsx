"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor


import { motion, AnimatePresence } from "framer-motion"

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { fixed?: boolean }
>(({ className, align = "center", sideOffset = 4, fixed = false, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <AnimatePresence>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        asChild={fixed}
        className={cn(
          "z-50 w-72 rounded-2xl border-2 border-border/30 bg-popover/95 p-4 text-popover-foreground shadow-2xl outline-none backdrop-blur-xl animate-in fade-in-0 zoom-in-95 transition-all duration-300",
          fixed && "fixed top-16 right-4 md:right-8",
          className
        )}
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22, type: "spring", bounce: 0.18 }}
          whileHover={{ scale: 1.01, boxShadow: "0 12px 32px 0 rgba(0,0,0,0.10)" }}
        >
          {props.children}
        </motion.div>
      </PopoverPrimitive.Content>
    </AnimatePresence>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
