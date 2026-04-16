export const formatDate = (date: string) => {
  const d = new Date(date)
  return isNaN(d.getTime())
    ? date
    : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
