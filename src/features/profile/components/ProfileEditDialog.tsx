import { useEffect, useState, type FormEvent } from 'react'
import { ApiError } from '@/shared/api/errors'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { useUpdateProfile } from '../hooks/use-update-profile'

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nickname: string
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  nickname,
}: ProfileEditDialogProps) {
  const [nicknameInput, setNicknameInput] = useState(nickname)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const updateProfile = useUpdateProfile()

  useEffect(() => {
    if (!open) return
    setNicknameInput(nickname)
    setErrorMessage(null)
  }, [nickname, open])

  const trimmedNickname = nicknameInput.trim()
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isNicknameValid) {
      setErrorMessage('닉네임은 2~12자로 입력해 주세요.')
      return
    }

    try {
      setErrorMessage(null)
      await updateProfile.mutateAsync({
        nickname: trimmedNickname,
      })
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError && error.errorBody?.message) {
        setErrorMessage(error.errorBody.message)
        return
      }
      setErrorMessage('닉네임을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(22rem,calc(100vw-2rem))] max-w-none rounded-2xl p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl">닉네임 수정</DialogTitle>
          <DialogDescription>공개 코스와 여행자 랭킹에 표시되는 이름이에요.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <label className="block space-y-2">
            <span className="text-on-surface text-sm font-semibold">닉네임</span>
            <Input
              value={nicknameInput}
              onChange={(event) => setNicknameInput(event.target.value.slice(0, 12))}
              maxLength={12}
              autoComplete="nickname"
              aria-invalid={nicknameInput.length > 0 && !isNicknameValid}
              className="h-12 rounded-xl bg-white text-base"
              placeholder="2~12자로 입력"
            />
            <span className="text-on-surface-variant block text-right text-xs">
              {nicknameInput.length}/12
            </span>
          </label>

          {errorMessage ? (
            <p className="bg-error-container/20 text-error rounded-lg px-3 py-2 text-sm">
              {errorMessage}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!isNicknameValid || updateProfile.isPending}
              className="h-11 rounded-xl"
            >
              {updateProfile.isPending ? '저장 중' : '저장하기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
