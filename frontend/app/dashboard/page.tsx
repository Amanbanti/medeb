"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Trophy, TrendingUp, Clock, Users, Plus, Eye, Loader2, Crown, Target, Activity } from "lucide-react"
import { formatCurrency, type WalletBalance, type Transaction } from "@/lib/wallet"
import { formatTimeRemaining, type LotteryPool } from "@/lib/pools"

// Mock user for demo
const mockUser = {
  id: "user-123",
  username: "testuser",
  phone_number: "+251911234567",
  is_admin: false,
}

interface DashboardStats {
  totalWinnings: number
  poolsJoined: number
  poolsWon: number
  winRate: number
}

export default function DashboardPage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [activePools, setActivePools] = useState<LotteryPool[]>([])
  const [myPools, setMyPools] = useState<LotteryPool[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [balanceRes, poolsRes, transactionsRes, statsRes] = await Promise.all([
        fetch("/api/wallet/balance"),
        fetch("/api/pools"),
        fetch("/api/wallet/transactions"),
        fetch("/api/dashboard/stats"),
      ])

      const [balanceData, poolsData, transactionsData, statsData] = await Promise.all([
        balanceRes.json(),
        poolsRes.json(),
        transactionsRes.json(),
        statsRes.json(),
      ])

      if (balanceData.success) setBalance(balanceData.balance)
      if (poolsData.success) {
        setActivePools(poolsData.pools.slice(0, 3)) // Show top 3 pools
        // Mock user's joined pools
        setMyPools([
          {
            ...poolsData.pools[0],
            name: "My Daily Lucky 50",
            status: "active" as const,
            current_participants: 8,
          },
        ])
      }
      if (transactionsData.success) setRecentTransactions(transactionsData.transactions.slice(0, 5))
      if (statsData.success) setStats(statsData.stats)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar user={mockUser} />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={mockUser} />

      <div className="flex-1 md:ml-64 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {mockUser.username}!</h1>
              <p className="text-muted-foreground">Here's what's happening with your lottery pools</p>
            </div>
            <Link href="/pools">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Join New Pool
              </Button>
            </Link>
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
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {balance ? formatCurrency(balance.balance) : "Loading..."}
                </div>
                <p className="text-xs text-muted-foreground">Available for pools</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats ? formatCurrency(stats.totalWinnings) : "0 ETB"}
                </div>
                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pools Joined</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats ? stats.poolsJoined : 0}</div>
                <p className="text-xs text-muted-foreground">Total participation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats ? `${stats.winRate}%` : "0%"}</div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* My Active Pools */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    My Active Pools
                  </CardTitle>
                  <CardDescription>Pools you've joined that are still active</CardDescription>
                </CardHeader>
                <CardContent>
                  {myPools.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Active Pools</h3>
                      <p className="text-muted-foreground mb-4">You haven't joined any pools yet</p>
                      <Link href="/pools">
                        <Button>Browse Pools</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myPools.map((pool) => (
                        <div key={pool.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{pool.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {pool.current_participants}/{pool.max_participants} participants
                              </p>
                              {pool.draw_date && (
                                <p className="text-sm text-orange-600">{formatTimeRemaining(pool.draw_date)}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(pool.total_prize)}</p>
                            <p className="text-sm text-muted-foreground">Prize Pool</p>
                            <Link href={`/pools/${pool.id}`}>
                              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Featured Pools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Featured Pools
                  </CardTitle>
                  <CardDescription>Popular pools you might be interested in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {activePools.slice(0, 2).map((pool) => (
                      <div key={pool.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{pool.name}</h4>
                          <Badge variant="default">{formatCurrency(pool.entry_fee)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{pool.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {pool.current_participants}/{pool.max_participants} joined
                          </span>
                          <span className="text-green-600">{formatCurrency(pool.total_prize)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 mb-3">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min((pool.current_participants / pool.max_participants) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <Link href={`/pools/${pool.id}/join`}>
                          <Button size="sm" className="w-full">
                            Join Pool
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/pools">
                      <Button variant="outline">View All Pools</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                          {transaction.type === "deposit" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {transaction.type === "withdrawal" && (
                            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                          )}
                          {transaction.type === "pool_entry" && <Trophy className="h-4 w-4 text-blue-600" />}
                          {transaction.type === "prize_win" && <Crown className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${
                              transaction.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Link href="/wallet">
                    <Button variant="outline" size="sm">
                      View All Transactions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
