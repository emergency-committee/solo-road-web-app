import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

interface DeleteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteReviewDialog({ open, onOpenChange, onConfirm }: DeleteReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰를 삭제할까요?</DialogTitle>
          <DialogDescription>이 작업은 되돌릴 수 없습니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="font-label-md text-on-surface-variant hover:bg-surface-container px-md py-sm rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="font-label-md hover:bg-error/90 bg-error px-md py-sm text-on-error rounded-lg transition-colors"
          >
            삭제
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
