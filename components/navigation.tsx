'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/create', label: 'Create Form' },
    { href: '/preview', label: 'Preview' },
    { href: '/myforms', label: 'My Forms' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-purple-600">upliance.ai</div>
            <div className="text-sm text-gray-500">Form Builder</div>
          </div>
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? 'default' : 'ghost'}
                className={cn(
                  pathname === item.href && 'bg-purple-600 hover:bg-purple-700'
                )}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
