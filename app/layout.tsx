import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Teo Chat — Estudo Teológico com IA',
  description: 'Estudo bíblico profundo com inteligência artificial. 5 modelos especializados: ABC, EEP, EMI, EVR e CLI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
