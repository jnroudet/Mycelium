import { cn } from '../../lib/utils'

export function Badge({ children, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5',
        'text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
