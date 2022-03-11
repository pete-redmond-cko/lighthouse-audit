export const createReportName = (url: string): string => {
  const timestamp = Date.now()
  const parsedHost = new URL(url).host.replace(/\./g, '-')
  return `${parsedHost}-${timestamp}.html`
}
