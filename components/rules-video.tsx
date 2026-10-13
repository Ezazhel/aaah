'use client'

import { useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { RULES_VIDEO_PROVIDER_NAMES, rulesVideoEmbedUrl, rulesVideoThumbnail, type RulesVideo as Video } from "@/lib/rules-video"

type RulesVideoProps = {
  video: Video
  /** Game name, for the accessible names. */
  title: string
  className?: string
}

/**
 * Rules video: a still with a play button, replaced by the YouTube/Vimeo player on click.
 * Nothing is loaded from the video site (nor any tracking cookie) before that.
 */
export function RulesVideo({ video, title, className }: RulesVideoProps) {
  const [playing, setPlaying] = useState(false)
  const thumbnail = rulesVideoThumbnail(video)

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-xl bg-brand-dark shadow", className)}>
      {playing ? (
        <iframe
          src={rulesVideoEmbedUrl(video)}
          title={`Règles de ${title} en vidéo`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Lire la vidéo des règles de ${title} (${RULES_VIDEO_PROVIDER_NAMES[video.provider]})`}
          className="group absolute inset-0 flex size-full items-center justify-center focus-visible:outline-none"
        >
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element -- served by YouTube, not worth the image optimizer
            <img src={thumbnail} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
          )}
          <span className="relative flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-white">
            <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
          </span>
        </button>
      )}
    </div>
  )
}
