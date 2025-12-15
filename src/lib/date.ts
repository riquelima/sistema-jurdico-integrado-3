export function formatDateBR(value: string | Date | null | undefined): string {
  if (!value) return '-'
  try {
    const d = typeof value === 'string' ? new Date(value) : value
    if (!d || isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString('pt-BR')
  } catch {
    return String(value || '-')
  }
}

export function formatDateTimeBR(value: string | Date | null | undefined): string {
  if (!value) return '-'
  try {
    const d = typeof value === 'string' ? new Date(value) : value
    if (!d || isNaN(d.getTime())) return String(value)
    const date = d.toLocaleDateString('pt-BR')
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return `${date} ${time}`
  } catch {
    return String(value || '-')
  }
}

