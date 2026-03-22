'use client'

import { logOut } from "@/app/logout/actions"

export default function LogoutButton() {
  return (
    <form action={logOut}>
      <button 
        type="submit"
        className="py-2 px-4 border rounded-md text-sm font-medium text-muted bg-surface hover:border-border2 hover:text-text transition-colors"
      >
        Sair
      </button>
    </form>
  )
}
