import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
  secondary: 'bg-stone-100 text-stone-800 hover:bg-stone-200 active:bg-stone-300',
  ghost: 'text-stone-600 hover:bg-stone-100 active:bg-stone-200',
  danger: 'bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200',
}

export function Button({ variant = 'primary', className, disabled, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5',
        'text-sm font-medium transition-colors duration-100',
        'disabled:pointer-events-none disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2',
        variants[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
