export function ReviewSummaryBanner({ recommenderCount }: { recommenderCount: number }) {
  return (
    <section className="border-outline-variant/20 mb-xl bg-surface-container-low p-md flex items-center rounded-xl border">
      <p className="text-body-sm text-on-surface">
        <span className="text-primary font-bold">{recommenderCount}명의 혼행족</span>이 이 장소를
        추천했습니다.
      </p>
    </section>
  )
}
