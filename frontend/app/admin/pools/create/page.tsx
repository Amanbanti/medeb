"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/layout/sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Plus, Trophy } from "lucide-react"

// Mock admin user
const mockAdmin = {
  username: "admin",
  is_admin: true,
}

interface CreatePoolForm {
  name: string
  description: string
  entry_fee: string
  min_participants: string
  max_participants: string
  winner_count: string
  draw_hours: string
}

export default function CreatePoolPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState<CreatePoolForm>({
    name: "",
    description: "",
    entry_fee: "",
    min_participants: "",
    max_participants: "",
    winner_count: "1",
    draw_hours: "24",
  })

  const handleInputChange = (field: keyof CreatePoolForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/admin/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          entry_fee: Number.parseFloat(formData.entry_fee),
          min_participants: Number.parseInt(formData.min_participants),
          max_participants: Number.parseInt(formData.max_participants),
          winner_count: Number.parseInt(formData.winner_count),
          draw_hours: Number.parseInt(formData.draw_hours),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Pool created successfully!")
        setTimeout(() => {
          router.push("/admin/pools")
        }, 2000)
      } else {
        setError(data.message || "Failed to create pool")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={mockAdmin} />

      <div className="flex-1 md:ml-64 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Create New Pool</h1>
              <p className="text-muted-foreground">Set up a new lottery pool for users</p>
            </div>
          </div>

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

          {/* Create Pool Form */}
          <Card>
            <CardHeader>
              <CardTitle>Pool Details</CardTitle>
              <CardDescription>Configure the lottery pool settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Pool Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Daily Lucky 50"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the pool and its prizes..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Pool Settings */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entry_fee">Entry Fee (ETB) *</Label>
                    <Input
                      id="entry_fee"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="50.00"
                      value={formData.entry_fee}
                      onChange={(e) => handleInputChange("entry_fee", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="winner_count">Number of Winners *</Label>
                    <Input
                      id="winner_count"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="1"
                      value={formData.winner_count}
                      onChange={(e) => handleInputChange("winner_count", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="min_participants">Minimum Participants *</Label>
                    <Input
                      id="min_participants"
                      type="number"
                      min="2"
                      placeholder="5"
                      value={formData.min_participants}
                      onChange={(e) => handleInputChange("min_participants", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="max_participants">Maximum Participants *</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      min="2"
                      placeholder="20"
                      value={formData.max_participants}
                      onChange={(e) => handleInputChange("max_participants", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Timing */}
                <div>
                  <Label htmlFor="draw_hours">Draw Time (Hours from now) *</Label>
                  <Input
                    id="draw_hours"
                    type="number"
                    min="1"
                    max="168"
                    placeholder="24"
                    value={formData.draw_hours}
                    onChange={(e) => handleInputChange("draw_hours", e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Pool will automatically close and draw winners after this time
                  </p>
                </div>

                {/* Preview */}
                {formData.entry_fee && formData.max_participants && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Pool Preview</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Maximum Pool Size:</span>
                        <p className="font-semibold">
                          {(Number.parseFloat(formData.entry_fee) * Number.parseInt(formData.max_participants)).toFixed(
                            2,
                          )}{" "}
                          ETB
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prize Pool (90%):</span>
                        <p className="font-semibold text-green-600">
                          {(
                            Number.parseFloat(formData.entry_fee) *
                            Number.parseInt(formData.max_participants) *
                            0.9
                          ).toFixed(2)}{" "}
                          ETB
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Platform Commission (10%):</span>
                        <p className="font-semibold">
                          {(
                            Number.parseFloat(formData.entry_fee) *
                            Number.parseInt(formData.max_participants) *
                            0.1
                          ).toFixed(2)}{" "}
                          ETB
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Winners:</span>
                        <p className="font-semibold">{formData.winner_count} player(s)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-4">
                  <Link href="/admin" className="flex-1">
                    <Button type="button" variant="outline" className="w-full bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Plus className="w-4 h-4 mr-2" />
                    Create Pool
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
