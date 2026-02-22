"use client"

import { motion } from "framer-motion"

export default function PlaybooksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Playbook Lab</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Your edge, codified.
          </p>
        </div>
      </div>
      <div className="text-center py-20 text-[var(--text-muted)]">
        Loading playbooks...
      </div>
    </motion.div>
  )
}
