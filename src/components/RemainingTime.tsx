"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function RemainingTime() {
    const { user } = useAuth();
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        if (user?.isPremium && user.subscription === 'daily' && user.subscriptionEndDate) {
            const timeLeft = user.subscriptionEndDate - new Date().getTime();
            if (timeLeft > 0) {
                setRemainingTime(timeLeft);
            }
        }
    }, [user]);

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1000) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [remainingTime]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    if (!user?.isPremium || user.subscription !== 'daily' || remainingTime <= 0) {
        return null;
    }

    return (
        <div className="text-right mb-4">
            <span className="text-sm font-semibold">Remaining time: {formatTime(remainingTime)}</span>
        </div>
    );
}
