"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Gem } from "lucide-react";

const features = [
  "Unlimited recipe generations",
  "AI-powered step-by-step instructions",
  "Save and access favorite recipes",
  "Priority support",
];

export default function PremiumPage() {
  const { user, upgradePremium } = useAuth();

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 min-h-[calc(100vh-3.5rem)] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Gem className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-headline mt-4">Go Premium</CardTitle>
          <CardDescription>Unlock the full power of AI Recipe Curator.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-center">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
            </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {features.map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {user?.isPremium ? (
             <div className="w-full text-center text-lg font-semibold text-green-600">
                You are already a Premium Member!
             </div>
          ) : user?.isLoggedIn ? (
            <Button onClick={upgradePremium} className="w-full" size="lg">
              Upgrade Now
            </Button>
          ) : (
             <p className="w-full text-center text-sm text-muted-foreground">Please log in to upgrade.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
