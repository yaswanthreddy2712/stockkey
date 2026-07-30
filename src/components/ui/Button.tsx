import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const classes: Record<Variant, string> = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${classes[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
