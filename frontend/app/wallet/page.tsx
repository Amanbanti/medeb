"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sidebar } from "@/components/layout/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, Minus, History, Loader2, CreditCard, Banknote } from "lucide-react"
import {
  formatCurrency,
  getTransactionIcon,
  getTransactionColor,
  type WalletBalance,
  type Transaction,
} from "@/lib/wallet"

// Mock user for demo
const mockUser = {
  username: "testuser",
  is_admin: false,
}

export default function WalletPage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        fetch("/api/wallet/balance"),
        fetch("/api/wallet/transactions"),
      ])

      const balanceData = await balanceRes.json()
      const transactionsData = await transactionsRes.json()

      if (balanceData.success) setBalance(balanceData.balance)
      if (transactionsData.success) setTransactions(transactionsData.transactions)
    } catch (err) {
      setError("Failed to load wallet data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(depositAmount) }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setDepositAmount("")
        loadWalletData()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(withdrawAmount) }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setWithdrawAmount("")
        loadWalletData()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setActionLoading(false)
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">My Wallet</h1>
              <p className="text-muted-foreground">Manage your funds and view transaction history</p>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {balance ? formatCurrency(balance.balance, balance.currency) : "Loading..."}
              </div>
              <p className="text-primary-foreground/80 mt-2">Available for lottery pools and withdrawals</p>
            </CardContent>
          </Card>

          {/* Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    Deposit Funds
                  </CardTitle>
                  <CardDescription>Add money to your LuckyBirr wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">Amount (ETB)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        min="10"
                        max="10000"
                        step="0.01"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">Minimum: 10 ETB • Maximum: 10,000 ETB</p>
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setDepositAmount("100")}>
                        100 ETB
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setDepositAmount("500")}>
                        500 ETB
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setDepositAmount("1000")}>
                        1000 ETB
                      </Button>
                    </div>

                    <Button type="submit" className="w-full" disabled={actionLoading}>
                      {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <CreditCard className="w-4 h-4 mr-2" />
                      Deposit Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Minus className="h-5 w-5 text-red-600" />
                    Withdraw Funds
                  </CardTitle>
                  <CardDescription>Transfer money from your wallet to your bank account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw-amount">Amount (ETB)</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        min="50"
                        max={balance?.balance || 0}
                        step="0.01"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Minimum: 50 ETB • Available: {balance ? formatCurrency(balance.balance) : "0 ETB"}
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={actionLoading}>
                      {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <Banknote className="w-4 h-4 mr-2" />
                      Request Withdrawal
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>View all your wallet transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                              {transaction.amount > 0 ? "+" : ""}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
