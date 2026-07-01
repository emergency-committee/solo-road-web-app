import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/course/')({
  component: CoursePage,
})

function CoursePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">AI 코스 생성</h1>
    </main>
  )
}
