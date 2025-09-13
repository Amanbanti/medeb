"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, Hash, Trophy, Loader2, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/wallet"

// Mock user for demo
const mockUser = {
  username: "testuser",
  is_admin: false,
}

interface TransparencyData {
  pool: {
    id: string
    name: string
    entry_fee: number
    participants_count: number
    total_prize: number
    draw_date: string
    status: string
  }
  draw_details: {
    seed: string
    algorithm: string
    timestamp: string
    block_hash?: string
    participants_hash: string
  }
  winners: Array<{
    position: number
    username: string
    user_hash: string
    prize_amount: number
    selection_proof: string
  }>
  verification: {
    is_verified: boolean
    verification_steps: string[]
  }
}

export default function TransparencyPage() {
  const params = useParams()
  const poolId = params.poolId as string

  const [data, setData] = useState<TransparencyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (poolId) {
      loadTransparencyData()
    }
  }, [poolId])

  const loadTransparencyData = async () => {
    try {
      const response = await fetch(`/api/transparency/${poolId}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.message || "Transparency data not found")
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

  if (!data) {
    return (
      <div className="flex h-screen">
        <Sidebar user={mockUser} />
        <div className="flex-1 md:ml-64 p-6">
          <Alert variant="destructive">
            <AlertDescription>{error || "Transparency data not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={mockUser} />

      <div className="flex-1 md:ml-64 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/history">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Provably Fair Verification</h1>
              <p className="text-muted-foreground">Transparent lottery draw verification</p>
            </div>
          </div>

          {/* Verification Status */}
          <Card className={data.verification.is_verified ? "border-green-500" : "border-yellow-500"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle
                  className={`h-5 w-5 ${data.verification.is_verified ? "text-green-600" : "text-yellow-600"}`}
                />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={data.verification.is_verified ? "default" : "secondary"} className="mb-4">
                {data.verification.is_verified ? "VERIFIED" : "PENDING"}
              </Badge>
              <div className="space-y-2">
                {data.verification.verification_steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pool Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pool Information</CardTitle>
              <CardDescription>Details about the lottery pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg">{data.pool.name}</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entry Fee:</span>
                      <span>{formatCurrency(data.pool.entry_fee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participants:</span>
                      <span>{data.pool.participants_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Prize:</span>
                      <span className="text-green-600">{formatCurrency(data.pool.total_prize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Draw Date:</span>
                      <span>{new Date(data.pool.draw_date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Badge variant="secondary">{data.pool.status.toUpperCase()}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Draw Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Draw Algorithm Details
              </CardTitle>
              <CardDescription>Cryptographic proof of fair random selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Random Seed</Label>
                  <Code>{data.draw_details.seed}</Code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated from blockchain hash + timestamp for unpredictability
                  </p>
                </div>

                <div>
                  <Label>Algorithm</Label>
                  <Code>{data.draw_details.algorithm}</Code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cryptographically secure random number generation
                  </p>
                </div>

                <div>
                  <Label>Draw Timestamp</Label>
                  <Code>{new Date(data.draw_details.timestamp).toISOString()}</Code>
                </div>

                <div>
                  <Label>Participants Hash</Label>
                  <Code>{data.draw_details.participants_hash}</Code>
                  <p className="text-xs text-muted-foreground mt-1">SHA-256 hash of all participants at draw time</p>
                </div>

                {data.draw_details.block_hash && (
                  <div>
                    <Label>Blockchain Reference</Label>
                    <Code>{data.draw_details.block_hash}</Code>
                    <p className="text-xs text-muted-foreground mt-1">
                      External entropy source for additional randomness
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Winners */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Winners & Selection Proof
              </CardTitle>
              <CardDescription>Verified winners with cryptographic proof</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.winners.map((winner) => (
                  <div key={winner.position} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {winner.position}
                        </div>
                        <div>
                          <h4 className="font-semibold">{winner.username}</h4>
                          <p className="text-sm text-muted-foreground">
                            {winner.position === 1 ? "1st" : winner.position === 2 ? "2nd" : `${winner.position}rd`}{" "}
                            Place Winner
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(winner.prize_amount)}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <Label>User Hash</Label>
                        <Code>{winner.user_hash}</Code>
                      </div>
                      <div>
                        <Label>Selection Proof</Label>
                        <Code>{winner.selection_proof}</Code>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mathematical proof showing how this user was selected as winner
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Verify</CardTitle>
              <CardDescription>Steps to independently verify the draw results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    1
                  </div>
                  <p>Copy the random seed and participants hash from above</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    2
                  </div>
                  <p>Use the SHA-256 algorithm to combine seed + participants hash</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    3
                  </div>
                  <p>Apply modulo operation with participant count to get winner indices</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    4
                  </div>
                  <p>Compare your results with the selection proofs above</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-muted-foreground mb-1">{children}</p>
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="block p-2 bg-muted rounded text-xs font-mono break-all">{children}</code>
}
