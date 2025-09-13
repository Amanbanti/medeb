import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Medeb</h1>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Win Big with <span className="text-primary">Medeb</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Join lottery pools with friends and fellow players. Fair, transparent, and exciting lottery experience in
            Ethiopia.
          </p>
          <div className="space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Playing Now
              </Button>
            </Link>
            <Link href="/pools">
              <Button size="lg" variant="outline">
                View Active Pools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose LuckyBirr?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Trophy className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Fair Winners</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Provably fair random selection ensures every participant has an equal chance to win.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Pool Together</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join pools with different entry fees and participant limits to match your budget.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Secure Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your funds are safe with our secure wallet system and instant prize distribution.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Instant Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Winners receive their prizes instantly when pools close. No waiting, no delays.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Lucky?</h3>
          <p className="text-muted-foreground mb-8">Join thousands of players already winning with LuckyBirr</p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 LuckyBirr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
