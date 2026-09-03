import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { useExportContext } from "../../contexts/ExportContext";

interface Props extends HTMLMotionProps<"div"> {
  children: ReactNode;
  as?: "div" | "section";
}

export default function AnimatedSection({ children, as = "div", ...props }: Props) {
  const { isExporting } = useExportContext();

  const MotionComponent = as === "section" ? motion.section : motion.div;

  // If exporting, we force the component to fully render its 'onscreen' state immediately
  // bypassing the whileInView trigger so that off-screen elements don't appear blank in the export.
  const animationProps = isExporting
    ? { initial: "onscreen", animate: "onscreen" }
    : { initial: "offscreen", whileInView: "onscreen", viewport: { once: true, amount: 0.3 } };

  return (
    <MotionComponent {...animationProps} {...props}>
      {children}
    </MotionComponent>
  );
}
