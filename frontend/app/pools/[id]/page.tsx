"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Users, Loader2, ArrowLeft, Crown } from "lucide-react"
import { formatCurrency } from "@/lib/wallet"
import { formatTimeRemaining, getPoolStatusBadge, calculatePrizeDistribution, type LotteryPool } from "@/lib/pools"

// Mock user for demo
const mockUser = {
  username: "testuser",
  is_admin: false,
}

export default function PoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const poolId = params.id as string

  const [pool, setPool] = useState<LotteryPool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (poolId) {
      loadPool()
    }
  }, [poolId])

  const loadPool = async () => {
    try {
      const response = await fetch(`/api/pools/${poolId}`)
      const data = await response.json()

      if (data.success) {
        setPool(data.pool)
      } else {
        setError(data.message || "Pool not found")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinPool = () => {
    router.push(`/pools/${poolId}/join`)
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

  if (!pool) {
    return (
      <div className="flex h-screen">
        <Sidebar user={mockUser} />
        <div className="flex-1 md:ml-64 p-6">
          <Alert variant="destructive">
            <AlertDescription>{error || "Pool not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const prizeDistribution = calculatePrizeDistribution(pool.total_prize, pool.winner_count)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={mockUser} />

      <div className="flex-1 md:ml-64 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/pools">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{pool.name}</h1>
              <p className="text-muted-foreground">Pool Details & Participants</p>
            </div>
          </div>

          {/* Pool Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pool Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pool Information
                  <Badge variant={getPoolStatusBadge(pool.status)}>{pool.status.toUpperCase()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{pool.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(pool.entry_fee)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Prize</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(pool.total_prize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="text-lg font-semibold">
                      {pool.current_participants}/{pool.max_participants}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Winners</p>
                    <p className="text-lg font-semibold">{pool.winner_count}</p>
                  </div>
                </div>

                {pool.draw_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Time Remaining</p>
                    <p className="text-lg font-semibold text-orange-600">{formatTimeRemaining(pool.draw_date)}</p>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((pool.current_participants / pool.max_participants) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min((pool.current_participants / pool.max_participants) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleJoinPool}
                  className="w-full"
                  size="lg"
                  disabled={pool.current_participants >= pool.max_participants || pool.status !== "active"}
                >
                  {pool.current_participants >= pool.max_participants ? "Pool is Full" : "Join This Pool"}
                </Button>
              </CardContent>
            </Card>

            {/* Prize Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Prize Distribution
                </CardTitle>
                <CardDescription>How the prize money will be distributed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prizeDistribution.map((prize, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">
                        {index === 0 ? "1st Place" : index === 1 ? "2nd Place" : `${index + 1}rd Place`}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(prize)}</span>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    * 10% platform commission is already deducted from the total pool
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({pool.participants?.length || 0})
              </CardTitle>
              <CardDescription>Players who have joined this pool</CardDescription>
            </CardHeader>
            <CardContent>
              {!pool.participants || pool.participants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No participants yet</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pool.participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Avatar>
                        <AvatarFallback>{participant.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.username || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(participant.joined_at).toLocaleDateString()}
                        </p>
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
