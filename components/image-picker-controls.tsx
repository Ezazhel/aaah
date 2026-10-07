'use client'

import { useRef } from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type useImagePicker } from "@/lib/upload-image"

type ImagePickerControlsProps = {
  picker: ReturnType<typeof useImagePicker>
  /** A picture is shown: stored one not removed, or a new one picked. */
  hasImage: boolean
  /** e.g. "la photo", "l'image" */
  noun: string
  addLabel: string
}

/**
 * "Add / change" and "remove" buttons around a hidden file input, with the picking error.
 */
export function ImagePickerControls({ picker, hasImage, noun, addLabel }: ImagePickerControlsProps) {
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col items-center gap-1">
      <input ref={fileInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden onChange={picker.onChange} />
      <div className="flex flex-wrap justify-center gap-1">
        <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
          <ImagePlus /> {hasImage ? `Changer ${noun}` : addLabel}
        </Button>
        {hasImage && (
          <Button type="button" variant="ghost" size="sm" onClick={picker.remove}>
            <Trash2 /> Retirer {noun}
          </Button>
        )}
      </div>
      {picker.error && <p role="alert" className="text-center text-sm text-destructive">{picker.error}</p>}
    </div>
  )
}
