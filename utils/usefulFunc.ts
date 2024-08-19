import React from 'react';
import Select from 'react-select';
import Flag from 'react-world-flags';
import moment from 'moment';

import Countdown, { CountdownRendererFn } from 'react-countdown';
export const currencyFormatter = (amount: number) => {
   if(!amount) return 
    const newCurrency = new Intl.NumberFormat()
    const result = newCurrency.format(amount)
    return result
  }



export const dateFormaterRelative = (dateString: string) => {
  const date = moment(dateString);

  // Format to "2 hours ago"
  const relativeTime = date.fromNow();
  
  // Format to "11 Jun, 2024"
  const formattedDate = date.format('DD MMM, YYYY');

  return {
    dateFromNow: relativeTime,
    formattedDate
  }

}
  
  






