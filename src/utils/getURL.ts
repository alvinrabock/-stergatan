import canUseDOM from "@/utillities/canUseDOM"

export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!url && process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `https://${process.env.NEXT_PUBLIC_BACKEND_URL}`
  }

  if (!url) {
    url = 'http://localhost:3000'
  }

  return url
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    return `https://${process.env.NEXT_PUBLIC_FRONTEND_URL}`
  }

  return process.env.NEXT_PUBLIC_FRONTEND_URL || ''
}