"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Trophy, Wallet, Users, Clock, ArrowLeft, Loader2, Shield, AlertTriangle } from "lucide-react"
import { formatCurrency, type WalletBalance } from "@/lib/wallet"
import { formatTimeRemaining, calculatePrizeDistribution, type LotteryPool } from "@/lib/pools"

// Mock user for demo
const mockUser = {
  username: "testuser",
  is_admin: false,
}

export default function JoinPoolPage() {
  const params = useParams()
  const router = useRouter()
  const poolId = params.id as string

  const [pool, setPool] = useState<LotteryPool | null>(null)
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    if (poolId) {
      loadData()
    }
  }, [poolId])

  const loadData = async () => {
    try {
      const [poolRes, balanceRes] = await Promise.all([fetch(`/api/pools/${poolId}`), fetch("/api/wallet/balance")])

      const [poolData, balanceData] = await Promise.all([poolRes.json(), balanceRes.json()])

      if (poolData.success) {
        setPool(poolData.pool)
      } else {
        setError(poolData.message || "Pool not found")
      }

      if (balanceData.success) {
        setBalance(balanceData.balance)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinPool = async () => {
    if (!pool || !agreedToTerms) return

    setJoining(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch(`/api/pools/${poolId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Successfully joined the pool!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.message || "Failed to join pool")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setJoining(false)
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

  const canJoin = balance && balance.balance >= pool.entry_fee && pool.current_participants < pool.max_participants
  const prizeDistribution = calculatePrizeDistribution(pool.total_prize, pool.winner_count)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={mockUser} />

      <div className="flex-1 md:ml-64 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href={`/pools/${poolId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Join Pool</h1>
              <p className="text-muted-foreground">Review details and confirm your entry</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Pool Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pool.name}
                <Badge variant="default">{pool.status.toUpperCase()}</Badge>
              </CardTitle>
              <CardDescription>{pool.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="font-semibold">{formatCurrency(pool.entry_fee)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Prize</p>
                    <p className="font-semibold text-green-600">{formatCurrency(pool.total_prize)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="font-semibold">
                      {pool.current_participants}/{pool.max_participants}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Left</p>
                    <p className="font-semibold text-orange-600">
                      {pool.draw_date ? formatTimeRemaining(pool.draw_date) : "TBD"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pool Progress</span>
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
            </CardContent>
          </Card>

          {/* Prize Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Prize Distribution</CardTitle>
              <CardDescription>How the prize money will be distributed among winners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Your Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">{balance ? formatCurrency(balance.balance) : "Loading..."}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">After Entry</p>
                  <p className="text-xl font-semibold">
                    {balance ? formatCurrency(balance.balance - pool.entry_fee) : "Loading..."}
                  </p>
                </div>
              </div>

              {balance && balance.balance < pool.entry_fee && (
                <Alert className="mt-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient balance. You need {formatCurrency(pool.entry_fee - balance.balance)} more to join this
                    pool.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Entry fees are non-refundable once the pool starts</p>
                <p>• Winners are selected using a provably fair random algorithm</p>
                <p>• Prizes are distributed automatically when the pool closes</p>
                <p>• LuckyBirr takes a 10% commission from the total pool</p>
                <p>• You must be 18+ years old to participate</p>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions and confirm I am 18+ years old
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Join Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleJoinPool}
                className="w-full"
                size="lg"
                disabled={!canJoin || !agreedToTerms || joining}
              >
                {joining && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {!canJoin && balance && balance.balance < pool.entry_fee
                  ? "Insufficient Balance"
                  : joining
                    ? "Joining Pool..."
                    : `Join Pool - ${formatCurrency(pool.entry_fee)}`}
              </Button>

              {!agreedToTerms && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Please agree to the terms and conditions to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
