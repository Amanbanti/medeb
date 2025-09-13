"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Search, Loader2, ArrowLeft, Eye, Shield } from "lucide-react"
import { formatCurrency } from "@/lib/wallet"

// Mock admin user
const mockAdmin = {
  username: "admin",
  is_admin: true,
}

interface User {
  id: string
  username: string
  phone_number: string
  email?: string
  is_verified: boolean
  is_admin: boolean
  wallet_balance: number
  pools_joined: number
  total_winnings: number
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
      } else {
        setError(data.message || "Failed to load users")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number.includes(searchTerm) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar user={mockAdmin} />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={mockAdmin} />

      <div className="flex-1 md:ml-64 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">View and manage platform users</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold">{users.length}</p>
                <p className="text-muted-foreground">Total Users</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{users.filter((u) => u.is_verified).length}</p>
                <p className="text-muted-foreground">Verified</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{users.filter((u) => u.is_admin).length}</p>
                <p className="text-muted-foreground">Admins</p>
              </div>
            </div>
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Registered users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "No users match your search criteria" : "No users registered yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{user.username}</h4>
                            {user.is_admin && (
                              <Badge variant="destructive">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {user.is_verified && <Badge variant="default">Verified</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                          {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                          <div>
                            <p className="font-semibold">{formatCurrency(user.wallet_balance)}</p>
                            <p className="text-muted-foreground">Balance</p>
                          </div>
                          <div>
                            <p className="font-semibold">{user.pools_joined}</p>
                            <p className="text-muted-foreground">Pools</p>
                          </div>
                          <div>
                            <p className="font-semibold text-green-600">{formatCurrency(user.total_winnings)}</p>
                            <p className="text-muted-foreground">Winnings</p>
                          </div>
                        </div>
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
