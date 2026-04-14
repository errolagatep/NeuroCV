import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { toast } from '../ui/Toast'

export function Navbar() {
  const { user } = useAuthStore()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast('info', 'Signed out')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard">
        <Logo size="sm" />
      </Link>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-gray-500">{user.email}</span>}
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </nav>
  )
}
