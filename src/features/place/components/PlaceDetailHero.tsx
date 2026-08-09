import { useRouter } from '@tanstack/react-router'
import { ArrowLeft, Heart, Share2 } from 'lucide-react'
import { useState } from 'react'

interface PlaceDetailHeroProps {
  imageUrl: string
  imageAlt: string
  liked?: boolean
  onToggleLike?: () => void
}

export function PlaceDetailHero({ imageUrl, imageAlt, liked, onToggleLike }: PlaceDetailHeroProps) {
  const router = useRouter()
  const [localSaved, setLocalSaved] = useState(false)
  const saved = liked ?? localSaved

  function handleToggle() {
    if (onToggleLike) {
      onToggleLike()
      return
    }
    setLocalSaved((prev) => !prev)
  }

  return (
    <header className="relative h-[397px] w-full overflow-hidden">
      <img src={imageUrl} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      <div className="px-margin-mobile py-lg absolute inset-x-0 top-0 z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="뒤로 가기"
          className="glass-effect text-on-surface flex size-10 items-center justify-center rounded-full shadow-md active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="gap-xs flex">
          <button
            type="button"
            aria-label="공유하기"
            className="glass-effect text-on-surface flex size-10 items-center justify-center rounded-full shadow-md active:scale-95"
          >
            <Share2 className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleToggle}
            aria-pressed={saved}
            aria-label="찜하기"
            className="glass-effect text-primary flex size-10 items-center justify-center rounded-full shadow-md active:scale-95"
          >
            <Heart className="size-5" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </header>
  )
}
