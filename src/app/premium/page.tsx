"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Gem, Loader2, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type View = 'options' | 'payment' | 'countdown' | 'already_premium';

const features = [
  "AI-powered step-by-step instructions",
  "Save and access favorite recipes",
  "Priority support",
];

export default function PremiumPage() {
  const { user, upgradePremium } = useAuth();
  const [view, setView] = useState<View>('options');
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'monthly'>('monthly');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (user?.isPremium) {
      if (user.subscription === 'monthly') {
        setView('already_premium');
      } else if (user.subscription === 'daily' && user.subscriptionEndDate) {
        const timeLeft = user.subscriptionEndDate - new Date().getTime();
        if (timeLeft > 0) {
          setRemainingTime(timeLeft);
          setView('countdown');
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (view === 'countdown' && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1000) {
            clearInterval(timer);
            // Optionally, refresh user state or show an expired message
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [view, remainingTime]);

  const handleProceedToPayment = () => {
    setView('payment');
  };

  const handlePayment = async () => {
    if (!phoneNumber.match(/^(07|01)\d{8}$/)) {
      alert("Please enter a valid phone number e.g 0712345678");
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    upgradePremium(selectedPlan);
    setIsProcessing(false);
  };
  
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const renderContent = () => {
    if (!user?.isLoggedIn) {
       return <p className="w-full text-center text-sm text-muted-foreground">Please log in to upgrade.</p>;
    }

    switch (view) {
      case 'already_premium':
        return (
          <div className="w-full text-center text-lg font-semibold text-green-600">
             You are already a Premium Member!
          </div>
        );

      case 'countdown':
        return (
          <div className="text-center space-y-2">
            <p className="font-semibold">Your daily plan is active!</p>
            <p className="text-sm text-muted-foreground">Time Remaining:</p>
            <p className="text-2xl font-bold font-mono tracking-wider">{formatTime(remainingTime)}</p>
          </div>
        );
        
      case 'payment':
        return (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Enter your MPesa number to complete the payment.
            </p>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                className="pl-10"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : `Pay Ksh ${selectedPlan === 'monthly' ? 200 : 20}`}
            </Button>
             <Button variant="link" onClick={() => setView('options')} className="w-full">
              Back to options
            </Button>
          </div>
        );
        
      case 'options':
      default:
        return (
          <>
            <CardContent className="space-y-6">
              <RadioGroup value={selectedPlan} onValueChange={(v: any) => setSelectedPlan(v)} className="grid grid-cols-1 gap-4">
                <Label htmlFor="monthly" className="flex items-center space-x-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5">
                  <RadioGroupItem value="monthly" id="monthly" className="h-5 w-5"/>
                  <div className="space-y-1">
                    <p className="font-semibold">Monthly Plan</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-xl font-bold text-foreground">Ksh 200</span> / month
                    </p>
                  </div>
                </Label>

                <Label htmlFor="daily" className="flex items-center space-x-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5">
                  <RadioGroupItem value="daily" id="daily" className="h-5 w-5"/>
                   <div className="space-y-1">
                    <p className="font-semibold">Daily Plan</p>
                    <p className="text-sm text-muted-foreground">
                       <span className="text-xl font-bold text-foreground">Ksh 20</span> / 24 hours
                    </p>
                  </div>
                </Label>
              </RadioGroup>

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
               <Button onClick={handleProceedToPayment} className="w-full" size="lg">
                Proceed to Payment
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 min-h-[calc(100vh-3.5rem)] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Gem className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-headline mt-4">Go Premium</CardTitle>
          <CardDescription>Unlock the full power of AI Recipe Curator.</CardDescription>
        </CardHeader>
        {view !== 'options' ? <CardContent>{renderContent()}</CardContent> : renderContent()}
      </Card>
    </div>
  );
}
