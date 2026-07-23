import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'

interface ProfileHeaderProps {
  name: string
  avatarUrl: string
  avatarAlt: string
}

export function ProfileHeader({ name, avatarUrl, avatarAlt }: ProfileHeaderProps) {
  return (
    <section className="mb-xl gap-lg bg-surface-container-lowest p-lg flex items-center rounded-xl shadow-sm">
      <Avatar className="border-primary-fixed size-20 border-2">
        <AvatarImage src={avatarUrl} alt={avatarAlt} />
        <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="gap-base flex flex-col">
        <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
          {name}
        </span>
      </div>
    </section>
  )
}
