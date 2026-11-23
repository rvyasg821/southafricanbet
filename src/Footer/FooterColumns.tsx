'use client'
import React, { useState } from 'react'

import type { Footer } from '@/payload-types'

import { FooterColumn } from './FooterColumn'

/** The footer link groups. On mobile/tablet only one group is open at a time. */
export const FooterColumns: React.FC<{ columns: NonNullable<Footer['columns']> }> = ({ columns }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      {columns.map((column, i) => (
        <FooterColumn
          column={column}
          key={column.id ?? i}
          onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
          open={openIndex === i}
        />
      ))}
    </>
  )
}
