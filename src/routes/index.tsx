import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-slate-900">솔로더</h1>
      <p className="mt-4 text-lg text-slate-600">혼자 여행하는 사람을 위한 AI 여행지 추천</p>
    </main>
  )
}
