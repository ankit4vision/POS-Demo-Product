export const formatCurrency = (amount) => {
  return `£${Number(amount).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
} 