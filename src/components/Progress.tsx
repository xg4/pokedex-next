import classNames from 'classnames'

export default function Progress({
  percent,
  color,
  className,
}: {
  percent: number
  color?: string
  className?: string
}) {
  return (
    <div className={classNames('h-0.5 w-10 bg-black/5', className)}>
      <div className="h-full max-w-full bg-blue-500" style={{ width: `${percent}%`, backgroundColor: color }}></div>
    </div>
  )
}
