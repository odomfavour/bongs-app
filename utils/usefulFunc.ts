import React from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
export const currencyFormatter = (amount: number) => {
    const newCurrency = new Intl.NumberFormat()
    const result = newCurrency.format(amount)
    return result
  }





interface CountdownTimerProps {
  targetDate: Date;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
 return 
};


