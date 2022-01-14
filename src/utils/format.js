const formatCurrency = (currency) => {
  const formatted = currency.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })

  return formatted
}

export {
  formatCurrency
}
