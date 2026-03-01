"use client"

import React, {
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { Check, Loader2, SendHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const DRAG_CONSTRAINTS = { left: 0, right: 155 }
const DRAG_THRESHOLD = 0.9

const BUTTON_STATES = {
  initial: { width: "100%" },
  completed: { width: "8rem" },
}

const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
}

type SlideButtonStatus = "idle" | "loading" | "success" | "error"

const StatusIcon: React.FC<{ status: SlideButtonStatus }> = ({ status }) => {
  const icons: Partial<Record<SlideButtonStatus, React.ReactNode>> = {
    loading: <Loader2 className="animate-spin" size={20} />,
    success: <Check size={20} />,
    error: <X size={20} />,
  }
  if (!icons[status]) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {icons[status]}
    </motion.div>
  )
}

export interface SlideButtonProps {
  onConfirm: () => void
  label?: string
  className?: string
}

const SlideButton = forwardRef<HTMLDivElement, SlideButtonProps>(
  ({ onConfirm, label = "Confirm Your Booking", className }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [status, setStatus] = useState<SlideButtonStatus>("idle")
    const dragHandleRef = useRef<HTMLDivElement | null>(null)

    const dragX = useMotionValue(0)
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
    const dragProgress = useTransform(
      springX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    )

    const handleDragStart = useCallback(() => {
      if (completed) return
      setIsDragging(true)
    }, [completed])

    const handleDragEnd = useCallback(() => {
      if (completed) return
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true)
        setStatus("loading")
        setTimeout(() => {
          setStatus("success")
          onConfirm()
        }, 1200)
      } else {
        dragX.set(0)
      }
    }, [completed, dragProgress, dragX, onConfirm])

    const handleDrag = useCallback(
      (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (completed) return
        const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right))
        dragX.set(newX)
      },
      [completed, dragX]
    )

    const adjustedWidth = useTransform(springX, (x) => x + 10)

    return (
      <motion.div
        ref={ref}
        animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
        transition={ANIMATION_CONFIG.spring}
        className={cn(
          "relative mx-auto flex h-12 items-center justify-center rounded-full bg-muted shadow-inner",
          className
        )}
      >
        {/* Label text */}
        {!completed && (
          <span className="pointer-events-none select-none text-sm font-medium text-muted-foreground pl-10">
            {label}
          </span>
        )}

        {/* Drag fill */}
        {!completed && (
          <motion.div
            style={{ width: adjustedWidth }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-primary/20"
          />
        )}

        {/* Drag handle */}
        <AnimatePresence>
          {!completed && (
            <motion.div
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: springX }}
              className="absolute left-1 z-10 flex cursor-grab items-center active:cursor-grabbing"
            >
              <Button
                type="button"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full shadow-lg",
                  isDragging && "scale-110 transition-transform"
                )}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed state */}
        <AnimatePresence>
          {completed && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                type="button"
                disabled={status === "loading"}
                className="h-full w-full rounded-full"
              >
                <AnimatePresence mode="wait">
                  <StatusIcon status={status} />
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)

SlideButton.displayName = "SlideButton"

export { SlideButton }
