import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_appLayout/')({
  loader: () => {
    throw redirect({
      to: '/home',
    })
  },
})
