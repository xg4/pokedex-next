export default function Progress({ percent, color }: { percent: number; color?: string }) {
  return (
    <div className="h-0.5 w-10 bg-black/5">
      <div className="h-full max-w-full" style={{ width: `${percent}%`, backgroundColor: color }}></div>
    </div>
  )
}
