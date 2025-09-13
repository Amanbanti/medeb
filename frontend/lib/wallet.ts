export interface WalletBalance {
  balance: number
  currency: string
}

export interface Transaction {
  id: string
  user_id: string
  type: "deposit" | "withdrawal" | "pool_entry" | "prize_win" | "commission"
  amount: number
  description: string
  pool_id?: string
  status: "pending" | "completed" | "failed"
  created_at: string
}

// Mock wallet service - replace with real implementation
export async function getWalletBalance(userId: string): Promise<WalletBalance> {
  // In real implementation, fetch from database
  return {
    balance: 250.0, // Mock balance
    currency: "ETB",
  }
}

export async function depositFunds(
  userId: string,
  amount: number,
): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
  // Mock deposit - in real implementation, integrate with payment gateway
  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    user_id: userId,
    type: "deposit",
    amount,
    description: `Deposit of ${amount} ETB`,
    status: "completed",
    created_at: new Date().toISOString(),
  }

  return {
    success: true,
    message: `Successfully deposited ${amount} ETB to your wallet`,
    transaction,
  }
}

export async function withdrawFunds(
  userId: string,
  amount: number,
): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
  // Mock withdrawal - in real implementation, process withdrawal
  const currentBalance = await getWalletBalance(userId)

  if (amount > currentBalance.balance) {
    return {
      success: false,
      message: "Insufficient balance",
    }
  }

  if (amount < 50) {
    return {
      success: false,
      message: "Minimum withdrawal amount is 50 ETB",
    }
  }

  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    user_id: userId,
    type: "withdrawal",
    amount: -amount,
    description: `Withdrawal of ${amount} ETB`,
    status: "pending",
    created_at: new Date().toISOString(),
  }

  return {
    success: true,
    message: `Withdrawal of ${amount} ETB is being processed`,
    transaction,
  }
}

export async function getTransactionHistory(userId: string): Promise<Transaction[]> {
  // Mock transaction history
  return [
    {
      id: "txn-1",
      user_id: userId,
      type: "deposit",
      amount: 500,
      description: "Initial deposit",
      status: "completed",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "txn-2",
      user_id: userId,
      type: "pool_entry",
      amount: -100,
      description: "Joined Weekly Mega 100 pool",
      pool_id: "pool-1",
      status: "completed",
      created_at: "2024-01-16T14:20:00Z",
    },
    {
      id: "txn-3",
      user_id: userId,
      type: "prize_win",
      amount: 450,
      description: "Won 1st place in Weekly Mega 100",
      pool_id: "pool-1",
      status: "completed",
      created_at: "2024-01-17T18:00:00Z",
    },
    {
      id: "txn-4",
      user_id: userId,
      type: "withdrawal",
      amount: -200,
      description: "Withdrawal to bank account",
      status: "completed",
      created_at: "2024-01-18T09:15:00Z",
    },
  ]
}

export function formatCurrency(amount: number, currency = "ETB"): string {
  return `${amount.toFixed(2)} ${currency}`
}

export function getTransactionIcon(type: Transaction["type"]): string {
  switch (type) {
    case "deposit":
      return "↗️"
    case "withdrawal":
      return "↙️"
    case "pool_entry":
      return "🎲"
    case "prize_win":
      return "🏆"
    case "commission":
      return "💼"
    default:
      return "💰"
  }
}

export function getTransactionColor(type: Transaction["type"]): string {
  switch (type) {
    case "deposit":
    case "prize_win":
      return "text-green-600"
    case "withdrawal":
    case "pool_entry":
    case "commission":
      return "text-red-600"
    default:
      return "text-foreground"
  }
}
