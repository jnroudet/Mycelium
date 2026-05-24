import { cn } from '../../lib/utils'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-2xl bg-white border border-stone-200 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  )
}
