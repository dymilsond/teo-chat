import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Teo Chat — Estudo Teológico com IA',
  description: 'Estudo bíblico profundo com inteligência artificial. 5 modelos especializados: ABC, EEP, EMI, EVR e CLI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
