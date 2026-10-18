'use client'

import { useRef } from "react"
import { ExternalLink, FilePlus, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRulesDate, gameRulesUrl } from "@/lib/game-rules"
import { type usePdfPicker } from "@/lib/upload-file"

type RulesPdfFieldProps = {
  picker: ReturnType<typeof usePdfPicker>
  /** Edition only: the stored PDF. */
  gameId?: string
  rulesUpdatedAt: string | null
}

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`

/**
 * Rules PDF of the game form: the stored or picked file, "add / replace" and "remove"
 * buttons around a hidden file input, and the picking error.
 */
export function RulesPdfField({ picker, gameId, rulesUpdatedAt }: RulesPdfFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const storedUrl = gameId && !picker.removed ? gameRulesUrl(gameId, rulesUpdatedAt) : null
  const hasPdf = Boolean(picker.file || storedUrl)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-700">PDF des règles</p>
      <input ref={fileInput} type="file" accept="application/pdf" className="sr-only" tabIndex={-1} aria-hidden onChange={picker.onChange} />

      {hasPdf && (
        <div className="flex items-center gap-3 rounded-md border border-input bg-white px-3 py-2 text-sm">
          <FileText className="size-5 shrink-0 text-primary" aria-hidden />
          {picker.file ? (
            <span className="min-w-0 break-words">
              <span className="font-semibold">{picker.file.name}</span>{' '}
              <span className="text-gray-500">({formatSize(picker.file.size)}, envoyé à l&apos;enregistrement)</span>
            </span>
          ) : storedUrl && rulesUpdatedAt && (
            <span className="flex flex-wrap items-center gap-x-3">
              <span>PDF actuel, mis à jour le {formatRulesDate(rulesUpdatedAt)}</span>
              <a href={storedUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                Ouvrir <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
          <FilePlus /> {hasPdf ? "Remplacer le PDF" : "Ajouter un PDF"}
        </Button>
        {hasPdf && (
          <Button type="button" variant="ghost" size="sm" onClick={picker.remove}>
            <Trash2 /> Retirer le PDF
          </Button>
        )}
      </div>
      {picker.error
        ? <p role="alert" className="text-sm text-destructive">{picker.error}</p>
        : <p className="text-xs text-gray-500">10 Mo maximum. Une nouvelle version remplace l&apos;ancienne.</p>}
    </div>
  )
}
