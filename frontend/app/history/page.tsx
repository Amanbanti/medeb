"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Trophy, Clock, Users, Loader2, Crown, Target, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/wallet"
import type { LotteryPool } from "@/lib/pools"

// Mock user for demo
const mockUser = {
  username: "testuser",
  is_admin: false,
}

interface PoolHistory {
  id: string
  pool: LotteryPool
  joined_at: string
  result?: {
    status: "won" | "lost" | "pending"
    position?: number
    prize_amount?: number
    total_winners: number
    draw_date: string
  }
}

interface WinHistory {
  id: string
  pool_name: string
  position: number
  prize_amount: number
  participants_count: number
  draw_date: string
}

export default function HistoryPage() {
  const [poolHistory, setPoolHistory] = useState<PoolHistory[]>([])
  const [winHistory, setWinHistory] = useState<WinHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const [poolsRes, winsRes] = await Promise.all([fetch("/api/history/pools"), fetch("/api/history/wins")])

      const [poolsData, winsData] = await Promise.all([poolsRes.json(), winsRes.json()])

      if (poolsData.success) setPoolHistory(poolsData.history)
      if (winsData.success) setWinHistory(winsData.wins)
    } catch (err) {
      setError("Failed to load history data")
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

  const totalPools = poolHistory.length
  const totalWins = winHistory.length
  const totalWinnings = winHistory.reduce((sum, win) => sum + win.prize_amount, 0)
  const winRate = totalPools > 0 ? Math.round((totalWins / totalPools) * 100) : 0

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={mockUser} />

      <div className="flex-1 md:ml-64 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">My History</h1>
              <p className="text-muted-foreground">View your lottery participation and results</p>
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
                <CardTitle className="text-sm font-medium">Pools Joined</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPools}</div>
                <p className="text-xs text-muted-foreground">Total participation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pools Won</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalWins}</div>
                <p className="text-xs text-muted-foreground">Successful wins</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(totalWinnings)}</div>
                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{winRate}%</div>
                <p className="text-xs text-muted-foreground">Success percentage</p>
              </CardContent>
            </Card>
          </div>

          {/* History Tabs */}
          <Tabs defaultValue="all-pools" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all-pools">All Pools</TabsTrigger>
              <TabsTrigger value="wins">My Wins</TabsTrigger>
              <TabsTrigger value="public-winners">Public Winners</TabsTrigger>
            </TabsList>

            <TabsContent value="all-pools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pool Participation History</CardTitle>
                  <CardDescription>All pools you've joined and their results</CardDescription>
                </CardHeader>
                <CardContent>
                  {poolHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Pool History</h3>
                      <p className="text-muted-foreground mb-4">You haven't joined any pools yet</p>
                      <Link href="/pools">
                        <Button>Browse Pools</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {poolHistory.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{entry.pool.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Entry: {formatCurrency(entry.pool.entry_fee)} • Joined{" "}
                                {new Date(entry.joined_at).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {entry.pool.current_participants} participants • {entry.pool.winner_count} winners
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {entry.result ? (
                              <div>
                                {entry.result.status === "won" ? (
                                  <div>
                                    <Badge variant="default" className="mb-2">
                                      <Crown className="w-3 h-3 mr-1" />
                                      {entry.result.position === 1
                                        ? "1st Place"
                                        : entry.result.position === 2
                                          ? "2nd Place"
                                          : `${entry.result.position}rd Place`}
                                    </Badge>
                                    <p className="font-semibold text-green-600">
                                      +{formatCurrency(entry.result.prize_amount || 0)}
                                    </p>
                                  </div>
                                ) : entry.result.status === "lost" ? (
                                  <Badge variant="secondary">No Win</Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(entry.result.draw_date).toLocaleDateString()}
                                </p>
                              </div>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wins" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    My Winning History
                  </CardTitle>
                  <CardDescription>Pools where you won prizes</CardDescription>
                </CardHeader>
                <CardContent>
                  {winHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Wins Yet</h3>
                      <p className="text-muted-foreground mb-4">Keep playing to win your first prize!</p>
                      <Link href="/pools">
                        <Button>Join a Pool</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {winHistory.map((win) => (
                        <div
                          key={win.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/20"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                              <Crown className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{win.pool_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {win.position === 1
                                  ? "1st Place"
                                  : win.position === 2
                                    ? "2nd Place"
                                    : `${win.position}rd Place`}{" "}
                                • {win.participants_count} participants
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Won on {new Date(win.draw_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">+{formatCurrency(win.prize_amount)}</p>
                            <p className="text-sm text-muted-foreground">Prize Won</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="public-winners" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Winners Board</CardTitle>
                  <CardDescription>Public transparency - recent lottery winners across all pools</CardDescription>
                </CardHeader>
                <CardContent>
                  <PublicWinnersBoard />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function PublicWinnersBoard() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPublicWinners()
  }, [])

  const loadPublicWinners = async () => {
    try {
      const response = await fetch("/api/public/winners")
      const data = await response.json()
      if (data.success) setWinners(data.winners)
    } catch (err) {
      console.error("Failed to load public winners")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {winners.map((winner, index) => (
        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Crown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold">{winner.pool_name}</h4>
              <p className="text-sm text-muted-foreground">
                Winner: {winner.username} • {new Date(winner.draw_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {winner.position === 1 ? "1st" : winner.position === 2 ? "2nd" : `${winner.position}rd`} Place of{" "}
                {winner.total_participants} participants
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600">{formatCurrency(winner.prize_amount)}</p>
            <Link href={`/transparency/${winner.pool_id}`}>
              <Button variant="outline" size="sm" className="mt-1 bg-transparent">
                <Eye className="w-4 h-4 mr-1" />
                View Proof
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
