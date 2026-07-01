import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recommend/')({
  component: RecommendPage,
})

function RecommendPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">여행지 추천</h1>
    </main>
  )
}
