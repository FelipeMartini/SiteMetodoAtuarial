'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarCustomProps {
  src?: string | null
  name?: string
  email?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showStatus?: boolean
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg'
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500'
}

/**
 * Avatar personalizado com fallback inteligente
 * Exibe imagem do usuário ou iniciais baseadas no nome/email
 */
export function AvatarCustom({
  src,
  name,
  email,
  size = 'md',
  className,
  showStatus = false,
  status = 'offline'
}: AvatarCustomProps) {
  // Gera as iniciais baseadas no nome ou email
  const getInitials = () => {
    if (name && name.trim()) {
      const nameParts = name.trim().split(' ')
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    
    if (email) {
      const emailUser = email.split('@')[0]
      return emailUser.substring(0, 2).toUpperCase()
    }
    
    return 'US'
  }

  // Gera uma cor consistente baseada no nome ou email
  const getBackgroundColor = () => {
    const str = name || email || 'default'
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="relative inline-block">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage 
          src={src || undefined} 
          alt={name || email || 'Avatar do usuário'}
        />
        <AvatarFallback 
          className={cn(
            'text-white font-semibold',
            getBackgroundColor()
          )}
        >
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <div 
          className={cn(
            'absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white',
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
