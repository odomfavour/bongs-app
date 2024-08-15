import React from 'react';
import Select from 'react-select';
import Flag from 'react-world-flags';

import Countdown, { CountdownRendererFn } from 'react-countdown';
export const currencyFormatter = (amount: number) => {
    const newCurrency = new Intl.NumberFormat()
    const result = newCurrency.format(amount)
    return result
  }





