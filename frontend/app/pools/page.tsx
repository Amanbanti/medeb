"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Users, Clock, Coins, Loader2, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/wallet"
import { formatTimeRemaining, getPoolStatusBadge, type LotteryPool } from "@/lib/pools"

// Mock user for demo
const mockUser = {
  username: "testuser",
  is_admin: false,
}

export default function PoolsPage() {
  const [pools, setPools] = useState<LotteryPool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadPools()

    // Update countdown timers every minute
    const interval = setInterval(() => {
      setPools((prevPools) => [...prevPools]) // Force re-render to update timers
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const loadPools = async () => {
    try {
      const response = await fetch("/api/pools")
      const data = await response.json()

      if (data.success) {
        setPools(data.pools)
      } else {
        setError(data.message || "Failed to load pools")
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Active Lottery Pools</h1>
              <p className="text-muted-foreground">Join a pool and win big prizes!</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Pools Grid */}
          {pools.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Pools</h3>
                <p className="text-muted-foreground text-center">
                  There are no active lottery pools at the moment. Check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pools.map((pool) => (
                <Card key={pool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{pool.name}</CardTitle>
                        <Badge variant={getPoolStatusBadge(pool.status)} className="mt-2">
                          {pool.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatCurrency(pool.entry_fee)}</p>
                        <p className="text-sm text-muted-foreground">Entry Fee</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm">{pool.description}</CardDescription>

                    {/* Pool Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {pool.current_participants}/{pool.max_participants}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {pool.winner_count} winner{pool.winner_count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-muted-foreground" />
                        <span>{formatCurrency(pool.total_prize)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">
                          {pool.draw_date ? formatTimeRemaining(pool.draw_date) : "No draw date"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round((pool.current_participants / pool.max_participants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((pool.current_participants / pool.max_participants) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {pool.min_participants - pool.current_participants > 0
                          ? `${pool.min_participants - pool.current_participants} more needed to start`
                          : "Ready to draw!"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/pools/${pool.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/pools/${pool.id}/join`} className="flex-1">
                        <Button
                          className="w-full"
                          disabled={pool.current_participants >= pool.max_participants || pool.status !== "active"}
                        >
                          {pool.current_participants >= pool.max_participants ? "Full" : "Join Pool"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
