"use client";

import { motion, useInView, type Variant } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type AnimationType =
  | "rollIn"
  | "whipIn"
  | "fadeIn"
  | "popIn"
  | "fadeInUp"
  | "shiftInUp"
  | "whipInUp"
  | "calmInUp";

interface TextAnimateProps {
  text: string;
  type?: AnimationType;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const animationVariants: Record<
  AnimationType,
  { hidden: Variant; visible: Variant }
> = {
  rollIn: {
    hidden: { opacity: 0, y: 20, rotateX: 90 },
    visible: { opacity: 1, y: 0, rotateX: 0 },
  },
  whipIn: {
    hidden: { opacity: 0, x: -50, rotate: -10 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  popIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  shiftInUp: {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  whipInUp: {
    hidden: { opacity: 0, y: 40, rotate: 5 },
    visible: { opacity: 1, y: 0, rotate: 0 },
  },
  calmInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

export function TextAnimate({
  text,
  type = "fadeInUp",
  className,
  delay = 0,
  staggerDelay = 0.05,
}: TextAnimateProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn("inline-flex flex-wrap", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={animationVariants[type]}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default TextAnimate;
