export interface LotteryPool {
  id: string
  name: string
  description: string
  entry_fee: number
  min_participants: number
  max_participants: number
  winner_count: number
  status: "active" | "closed" | "completed"
  draw_date?: string
  created_by: string
  created_at: string
  updated_at: string
  current_participants: number
  total_prize: number
  participants?: PoolParticipant[]
  winners?: PoolWinner[]
}

export interface PoolParticipant {
  id: string
  pool_id: string
  user_id: string
  username?: string
  joined_at: string
}

export interface PoolWinner {
  id: string
  pool_id: string
  user_id: string
  username?: string
  prize_amount: number
  position: number
  created_at: string
}

export interface JoinPoolResult {
  success: boolean
  message: string
  pool?: LotteryPool
}

// Mock pool service - replace with real database implementation
export async function getActivePools(): Promise<LotteryPool[]> {
  // Mock active pools
  return [
    {
      id: "pool-1",
      name: "Daily Lucky 50",
      description: "Join our daily lottery pool with 50 Birr entry fee. Winner takes 80% of the pool!",
      entry_fee: 50,
      min_participants: 5,
      max_participants: 20,
      winner_count: 1,
      status: "active",
      draw_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      created_by: "admin",
      created_at: "2024-01-20T08:00:00Z",
      updated_at: "2024-01-20T08:00:00Z",
      current_participants: 8,
      total_prize: 400,
    },
    {
      id: "pool-2",
      name: "Weekly Mega 100",
      description: "Weekly mega lottery with 100 Birr entry. Top 3 winners share the prize!",
      entry_fee: 100,
      min_participants: 10,
      max_participants: 50,
      winner_count: 3,
      status: "active",
      draw_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      created_by: "admin",
      created_at: "2024-01-19T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z",
      current_participants: 23,
      total_prize: 2300,
    },
    {
      id: "pool-3",
      name: "Premium 200",
      description: "Premium lottery pool for high rollers. 200 Birr entry, massive prizes!",
      entry_fee: 200,
      min_participants: 8,
      max_participants: 30,
      winner_count: 2,
      status: "active",
      draw_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      created_by: "admin",
      created_at: "2024-01-20T06:00:00Z",
      updated_at: "2024-01-20T06:00:00Z",
      current_participants: 12,
      total_prize: 2400,
    },
  ]
}

export async function getPoolById(poolId: string): Promise<LotteryPool | null> {
  const pools = await getActivePools()
  const pool = pools.find((p) => p.id === poolId)

  if (!pool) return null

  // Add mock participants
  pool.participants = [
    {
      id: "part-1",
      pool_id: poolId,
      user_id: "user-1",
      username: "player1",
      joined_at: "2024-01-20T09:00:00Z",
    },
    {
      id: "part-2",
      pool_id: poolId,
      user_id: "user-2",
      username: "player2",
      joined_at: "2024-01-20T09:15:00Z",
    },
    {
      id: "part-3",
      pool_id: poolId,
      user_id: "user-3",
      username: "player3",
      joined_at: "2024-01-20T09:30:00Z",
    },
  ]

  return pool
}

export async function joinPool(poolId: string, userId: string): Promise<JoinPoolResult> {
  const pool = await getPoolById(poolId)

  if (!pool) {
    return { success: false, message: "Pool not found" }
  }

  if (pool.status !== "active") {
    return { success: false, message: "Pool is no longer active" }
  }

  if (pool.current_participants >= pool.max_participants) {
    return { success: false, message: "Pool is full" }
  }

  // Check if user already joined (mock check)
  const alreadyJoined = pool.participants?.some((p) => p.user_id === userId)
  if (alreadyJoined) {
    return { success: false, message: "You have already joined this pool" }
  }

  // Mock wallet balance check
  const userBalance = 250 // Mock balance
  if (userBalance < pool.entry_fee) {
    return { success: false, message: "Insufficient wallet balance" }
  }

  // Update pool (in real implementation, update database)
  pool.current_participants += 1
  pool.total_prize += pool.entry_fee * 0.9 // 90% goes to prize pool, 10% commission

  return {
    success: true,
    message: `Successfully joined ${pool.name}!`,
    pool,
  }
}

export async function selectWinners(poolId: string): Promise<PoolWinner[]> {
  const pool = await getPoolById(poolId)

  if (!pool || !pool.participants) {
    return []
  }

  // Provably fair random selection
  const shuffled = [...pool.participants].sort(() => Math.random() - 0.5)
  const winners: PoolWinner[] = []

  const prizeDistribution = calculatePrizeDistribution(pool.total_prize, pool.winner_count)

  for (let i = 0; i < Math.min(pool.winner_count, shuffled.length); i++) {
    const participant = shuffled[i]
    winners.push({
      id: `winner-${Date.now()}-${i}`,
      pool_id: poolId,
      user_id: participant.user_id,
      username: participant.username,
      prize_amount: prizeDistribution[i],
      position: i + 1,
      created_at: new Date().toISOString(),
    })
  }

  return winners
}

export function calculatePrizeDistribution(totalPrize: number, winnerCount: number): number[] {
  if (winnerCount === 1) {
    return [totalPrize]
  }

  // Distribution for multiple winners
  const distribution: number[] = []
  let remaining = totalPrize

  if (winnerCount === 2) {
    distribution.push(totalPrize * 0.7) // 70% for 1st
    distribution.push(totalPrize * 0.3) // 30% for 2nd
  } else if (winnerCount === 3) {
    distribution.push(totalPrize * 0.5) // 50% for 1st
    distribution.push(totalPrize * 0.3) // 30% for 2nd
    distribution.push(totalPrize * 0.2) // 20% for 3rd
  } else {
    // For more winners, distribute more evenly
    const firstPrize = totalPrize * 0.4
    distribution.push(firstPrize)
    remaining -= firstPrize

    for (let i = 1; i < winnerCount; i++) {
      distribution.push(remaining / (winnerCount - 1))
    }
  }

  return distribution.map((amount) => Math.round(amount * 100) / 100)
}

export function formatTimeRemaining(drawDate: string): string {
  const now = new Date()
  const draw = new Date(drawDate)
  const diff = draw.getTime() - now.getTime()

  if (diff <= 0) {
    return "Draw completed"
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h remaining`
  }

  return `${hours}h ${minutes}m remaining`
}

export function getPoolStatusColor(status: LotteryPool["status"]): string {
  switch (status) {
    case "active":
      return "text-green-600"
    case "closed":
      return "text-yellow-600"
    case "completed":
      return "text-gray-600"
    default:
      return "text-foreground"
  }
}

export function getPoolStatusBadge(status: LotteryPool["status"]): "default" | "secondary" | "destructive" {
  switch (status) {
    case "active":
      return "default"
    case "closed":
      return "secondary"
    case "completed":
      return "secondary"
    default:
      return "secondary"
  }
}
