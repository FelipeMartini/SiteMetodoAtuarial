'use client'

import * as React from 'react'
/// <reference types="react/next" />
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { InputProps } from '@/components/ui/input'
import { cva, type VariantProps } from 'class-variance-authority'

const formFieldVariants = cva('space-y-2', {
  variants: {
    variant: {
      default: '',
      floating: 'relative',
      outline: 'border rounded-lg p-4 space-y-3',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface FormFieldProps
  extends Omit<InputProps, 'id' | 'variant'>,
    VariantProps<typeof formFieldVariants> {
  id: string
  label: string
  description?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  icon?: React.ReactNode
  className?: string
}

/**
 * Componente FormField avançado inspirado no fuse-react
 * Com validação visual e diferentes variants
 */
const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      className,
      variant,
      id,
      label,
      description,
      error = false,
      errorMessage,
      required,
      icon,
      ...inputProps
    }: FormFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const hasError = !!error

    return (
      <div className={cn(formFieldVariants({ variant }), className)}>
        {/* Label */}
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            hasError && 'text-destructive',
            required && "after:content-['*'] after:ml-0.5 after:text-destructive"
          )}
        >
          {label}
        </Label>

        {/* Input com ícone opcional */}
        <div className='relative'>
          {icon && (
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
              {icon}
            </div>
          )}
          <Input
            id={id}
            ref={ref}
            error={hasError}
            className={cn(icon && 'pl-10', hasError && 'focus-visible:ring-destructive/20')}
            {...inputProps}
          />
        </div>

        {/* Description ou Error */}
        {(description || errorMessage) && (
          <p
            className={cn(
              'text-xs leading-relaxed',
              hasError ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {errorMessage || description}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = 'FormField'

/**
 * Componente Container de Formulário com design aprimorado
 */
interface FormContainerProps extends React.HTMLAttributes<HTMLFormElement> {
  title?: string
  description?: string
  children: React.ReactNode
}

export const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <form ref={ref} className={cn('space-y-6', className)} {...props}>
        {(title || description) && (
          <div className='space-y-2'>
            {title && <h2 className='text-2xl font-semibold text-gradient'>{title}</h2>}
            {description && <p className='text-muted-foreground leading-relaxed'>{description}</p>}
          </div>
        )}
        {children}
      </form>
    )
  }
)
FormContainer.displayName = 'FormContainer'

/**
 * Componente Section para organizar campos de formulário
 */
interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children: React.ReactNode
}

export const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {(title || description) && (
          <div className='space-y-1'>
            {title && <h3 className='text-lg font-medium leading-none'>{title}</h3>}
            {description && (
              <p className='text-sm text-muted-foreground leading-relaxed'>{description}</p>
            )}
          </div>
        )}
        <div className='grid gap-4'>{children}</div>
      </div>
    )
  }
)
FormSection.displayName = 'FormSection'

export { FormField, formFieldVariants }
