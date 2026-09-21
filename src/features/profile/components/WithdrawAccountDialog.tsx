import { useEffect, useState, type FormEvent } from 'react'
import { useWithdrawAccount } from '@/features/auth'
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

interface WithdrawAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawAccountDialog({ open, onOpenChange }: WithdrawAccountDialogProps) {
  const [confirmation, setConfirmation] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const withdrawAccount = useWithdrawAccount()

  useEffect(() => {
    if (!open) return
    setConfirmation('')
    setErrorMessage(null)
  }, [open])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (confirmation.trim() !== '탈퇴' || withdrawAccount.isPending) return

    try {
      setErrorMessage(null)
      await withdrawAccount.mutateAsync()
    } catch (error) {
      if (error instanceof ApiError && error.errorBody?.message) {
        setErrorMessage(error.errorBody.message)
        return
      }
      setErrorMessage('회원 탈퇴를 처리하지 못했어요. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !withdrawAccount.isPending && onOpenChange(nextOpen)}
    >
      <DialogContent className="w-[min(22rem,calc(100vw-2rem))] max-w-none rounded-2xl p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl">정말 탈퇴할까요?</DialogTitle>
          <DialogDescription>
            탈퇴 후 30일 동안 계정을 복구할 수 있어요. 그동안 서비스 이용과 랭킹 노출은 중단되며,
            30일이 지나면 개인정보가 삭제돼요.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <label className="block space-y-2">
            <span className="text-on-surface text-sm font-semibold">
              확인을 위해 아래에 <strong className="text-error">탈퇴</strong>를 입력해 주세요.
            </span>
            <Input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
              className="h-12 rounded-xl bg-white text-base"
              placeholder="탈퇴"
              aria-label="회원 탈퇴 확인 문구"
            />
          </label>

          {errorMessage ? (
            <p
              className="bg-error-container/20 text-error rounded-lg px-3 py-2 text-sm"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              disabled={withdrawAccount.isPending}
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="h-11 rounded-xl"
              disabled={confirmation.trim() !== '탈퇴' || withdrawAccount.isPending}
            >
              {withdrawAccount.isPending ? '처리 중' : '회원 탈퇴'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
