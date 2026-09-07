import { Pencil, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'

interface ProfileHeaderProps {
  name: string
  avatarUrl?: string
  avatarAlt: string
  onEdit?: () => void
}

export function ProfileHeader({ name, avatarUrl, avatarAlt, onEdit }: ProfileHeaderProps) {
  return (
    <section className="mb-xl gap-lg bg-surface-container-lowest p-lg flex items-center rounded-xl shadow-sm">
      <Avatar className="border-primary-fixed size-20 border-2">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={avatarAlt} /> : null}
        <AvatarFallback className="bg-primary/10 text-primary">
          <UserRound className="size-9" />
        </AvatarFallback>
      </Avatar>
      <div className="gap-base flex flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface truncate font-bold">
            {name}
          </span>
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              aria-label="닉네임 수정"
              className="hover:bg-surface-container text-on-surface-variant grid size-8 shrink-0 place-items-center rounded-full transition-colors"
            >
              <Pencil className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
