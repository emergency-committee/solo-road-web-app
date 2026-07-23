export function ProfileStatsGrid({ stats }: { stats: { label: string; value: number }[] }) {
  return (
    <div className="mb-xl gap-md grid grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-container-low p-md flex flex-col items-center justify-center rounded-lg text-center"
        >
          <span className="font-headline-lg text-headline-lg text-primary">{stat.value}</span>
          <span className="font-label-md text-label-md text-on-surface-variant">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
