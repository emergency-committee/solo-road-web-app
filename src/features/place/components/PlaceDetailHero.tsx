import { useRouter } from '@tanstack/react-router'
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react'
import { useState } from 'react'
import { PlaceImagePlaceholder } from '@/shared/components/PlaceImagePlaceholder'

interface PlaceDetailHeroProps {
  /** 등록된 이미지가 없으면 null. */
  imageUrl: string | null
  imageAlt: string
  saved?: boolean
  saveDisabled?: boolean
  onToggleSave?: () => void
}

export function PlaceDetailHero({
  imageUrl,
  imageAlt,
  saved: controlledSaved,
  saveDisabled,
  onToggleSave,
}: PlaceDetailHeroProps) {
  const router = useRouter()
  const [localSaved, setLocalSaved] = useState(false)
  const saved = controlledSaved ?? localSaved

  function handleToggle() {
    if (onToggleSave) {
      onToggleSave()
      return
    }
    setLocalSaved((prev) => !prev)
  }

  return (
    <header className="relative h-[397px] w-full overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
      ) : (
        <PlaceImagePlaceholder className="absolute inset-0" />
      )}
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
            disabled={saveDisabled}
            aria-pressed={saved}
            aria-label={saved ? '저장 해제' : '장소 저장'}
            title={saved ? '저장 해제' : '장소 저장'}
            className={`glass-effect ${saved ? 'text-[#f05a47]' : 'text-on-surface-variant'} flex size-10 items-center justify-center rounded-full shadow-md active:scale-95 disabled:cursor-wait disabled:opacity-50`}
          >
            <Bookmark className="size-5" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </header>
  )
}
