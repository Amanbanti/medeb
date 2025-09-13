"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Trophy, DollarSign, Plus, Settings, Activity, Loader2, Crown } from "lucide-react"
import { formatCurrency } from "@/lib/wallet"

// Mock admin user
const mockAdmin = {
  username: "admin",
  is_admin: true,
}

interface AdminStats {
  totalUsers: number
  activePools: number
  totalRevenue: number
  totalPrizesPaid: number
  recentPools: Array<{
    id: string
    name: string
    participants: number
    status: string
    created_at: string
  }>
  recentUsers: Array<{
    id: string
    username: string
    phone_number: string
    created_at: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      } else {
        setError(data.message || "Failed to load admin stats")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your LuckyBirr platform</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/pools/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pool
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered players</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pools</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activePools || 0}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats ? formatCurrency(stats.totalRevenue) : "0 ETB"}
                </div>
                <p className="text-xs text-muted-foreground">Platform commission</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prizes Paid</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats ? formatCurrency(stats.totalPrizesPaid) : "0 ETB"}
                </div>
                <p className="text-xs text-muted-foreground">To winners</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Pools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Pools
                </CardTitle>
                <CardDescription>Latest lottery pools created</CardDescription>
              </CardHeader>
              <CardContent>
                {!stats?.recentPools || stats.recentPools.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent pools</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentPools.map((pool) => (
                      <div key={pool.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{pool.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pool.participants} participants • {new Date(pool.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={pool.status === "active" ? "default" : "secondary"}>
                            {pool.status.toUpperCase()}
                          </Badge>
                          <Link href={`/admin/pools/${pool.id}`}>
                            <Button variant="outline" size="sm" className="mt-1 ml-2 bg-transparent">
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Link href="/admin/pools">
                    <Button variant="outline">View All Pools</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Users
                </CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {!stats?.recentUsers || stats.recentUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent users</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{user.username}</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.phone_number} • {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Link href="/admin/users">
                    <Button variant="outline">View All Users</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/admin/pools/create">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                    <Plus className="h-6 w-6" />
                    Create New Pool
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                    <Users className="h-6 w-6" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                    <Settings className="h-6 w-6" />
                    Platform Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
