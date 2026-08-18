'use client'

import React from 'react'

export function FormattedMarkdown({
  content,
  className = '',
}: {
  content: string
  className?: string
}) {
  if (!content) return null

  // Replace single newlines before markdown elements with double newlines for clean block splitting
  const normalized = content
    .replace(/\r\n/g, '\n')
    .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
    .replace(/([^\n])\n(---|\*\*\*|___)/g, '$1\n\n$2')
    .replace(/([^\n])\n([-*]\s|\d+\.\s)/g, '$1\n\n$2')

  const lines = normalized.split('\n')
  const blocks: React.ReactNode[] = []
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null
  let currentTable: string[] | null = null

  const parseInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    // Regex matching **bold**, *italic*, and `code`
    const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`)/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }

      if (match[2] !== undefined) {
        // **bold**
        parts.push(
          <strong key={`b-${match.index}`} className="font-bold text-foreground">
            {parseInline(match[2])}
          </strong>
        )
      } else if (match[3] !== undefined) {
        // *italic*
        parts.push(
          <em key={`i-${match.index}`} className="italic text-dim">
            {match[3]}
          </em>
        )
      } else if (match[4] !== undefined) {
        // `code`
        parts.push(
          <code
            key={`c-${match.index}`}
            className="px-1.5 py-0.5 rounded bg-[hsl(var(--av-bg-panel))] border border-line font-mono-tech text-[11px] text-[hsl(var(--av-accent))]"
          >
            {match[4]}
          </code>
        )
      }

      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  const parseTableCells = (rowText: string): string[] => {
    const cleaned = rowText.trim().replace(/^\|/, '').replace(/\|$/, '')
    return cleaned.split('|').map((cell) => cell.trim())
  }

  const isTableSeparator = (lineText: string): boolean => {
    return /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/.test(lineText.trim())
  }

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type
      const listIdx = blocks.length
      blocks.push(
        <ListTag
          key={`list-${listIdx}`}
          className={`${currentList.type === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 space-y-1 my-2 text-foreground`}
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ListTag>
      )
      currentList = null
    }
  }

  const flushTable = () => {
    if (currentTable && currentTable.length >= 2) {
      const tableIdx = blocks.length
      const headerRow = parseTableCells(currentTable[0])

      const dataRows = currentTable
        .slice(1)
        .filter((row) => !isTableSeparator(row))
        .map((row) => parseTableCells(row))

      blocks.push(
        <div
          key={`table-${tableIdx}`}
          className="my-3.5 overflow-x-auto custom-scrollbar-x rounded-xl border border-line bg-[hsl(var(--av-bg-panel))] shadow-xl"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line bg-[hsl(var(--av-accent-soft))] text-[hsl(var(--av-accent))] font-bold font-mono-tech uppercase tracking-wider text-[11px]">
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx} className="p-3 border-r border-line/40 last:border-0 font-extrabold whitespace-nowrap">
                    {parseInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40 text-foreground font-sans">
              {dataRows.map((rowCells, rIdx) => (
                <tr key={rIdx} className="hover:bg-[hsl(var(--av-bg-raise))] transition-colors">
                  {rowCells.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 border-r border-line/30 last:border-0 align-top leading-relaxed text-xs">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    currentTable = null
  }

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim()

    // Table Row detection (lines with |)
    const isTableRow = line.includes('|') && (line.startsWith('|') || line.endsWith('|'))

    if (isTableRow) {
      flushList()
      if (!currentTable) {
        currentTable = []
      }
      currentTable.push(line)
      return
    } else {
      flushTable()
    }

    // Empty line -> flush list and table
    if (!line) {
      flushList()
      flushTable()
      return
    }

    // Horizontal Rule (--- or ***)
    if (/^(---|^\*\*\*|___)$/.test(line)) {
      flushList()
      flushTable()
      blocks.push(<hr key={`hr-${idx}`} className="border-t border-line my-3 opacity-60" />)
      return
    }

    // Headings ### ## #
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      flushList()
      flushTable()
      const level = headingMatch[1].length
      const headingText = headingMatch[2]
      if (level === 1) {
        blocks.push(
          <h1 key={`h1-${idx}`} className="font-display font-extrabold text-base md:text-lg text-foreground mt-3 mb-1.5">
            {parseInline(headingText)}
          </h1>
        )
      } else if (level === 2) {
        blocks.push(
          <h2 key={`h2-${idx}`} className="font-display font-bold text-sm md:text-base text-foreground mt-3 mb-1">
            {parseInline(headingText)}
          </h2>
        )
      } else {
        blocks.push(
          <h3 key={`h3-${idx}`} className="font-display font-semibold text-xs md:text-sm text-[hsl(var(--av-accent))] mt-2.5 mb-1">
            {parseInline(headingText)}
          </h3>
        )
      }
      return
    }

    // Bullet list item (- Item or * Item)
    const unorderedMatch = line.match(/^[-*]\s+(.*)$/)
    if (unorderedMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList()
        flushTable()
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(parseInline(unorderedMatch[1]))
      return
    }

    // Numbered list item (1. Item)
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (orderedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList()
        flushTable()
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(parseInline(orderedMatch[2]))
      return
    }

    // Regular paragraph
    flushList()
    flushTable()
    blocks.push(
      <p key={`p-${idx}`} className="leading-relaxed my-1">
        {parseInline(line)}
      </p>
    )
  })

  flushList()
  flushTable()

  return <div className={`space-y-1 text-xs md:text-sm ${className}`}>{blocks}</div>
}

export default FormattedMarkdown
