export function ReviewSummaryBanner({ reviewCount }: { reviewCount: number }) {
  return (
    <section className="border-outline-variant/20 mb-xl bg-surface-container-low p-md flex items-center rounded-xl border">
      <p className="text-body-sm text-on-surface">
        <span className="text-primary font-bold">{reviewCount}명의 혼행족</span>이 이 장소에 리뷰를
        남겼어요.
      </p>
    </section>
  )
}
