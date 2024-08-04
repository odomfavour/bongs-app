export const currencyFormatter = (amount: number) => {
    const newCurrency = new Intl.NumberFormat()
    const result = newCurrency.format(amount)
    return result
  }