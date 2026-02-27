'use client'

import { Message } from '@/types'

interface Props {
  message: Message
  modelIcon?: string
}

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```[\s\S]*?```/g, m => `<pre><code>${m.slice(3, -3).trim()}</code></pre>`)
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^## (.*$)/gm, '<h3>$1</h3>')
    .replace(/^# (.*$)/gm, '<h2>$1</h2>')
    .replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^\| (.*) \|$/gm, (_, row) => {
      const cells = row.split(' | ').map((c: string) => `<td>${c.trim()}</td>`).join('')
      return `<tr>${cells}</tr>`
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, m => {
      const rows = m.trim().split('\n')
      if (rows.length > 1) {
        const header = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')
        const body = rows.slice(2).join('\n')
        return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`
      }
      return `<table><tbody>${m}</tbody></table>`
    })
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
}

function formatTime(iso?: string) {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function MessageBubble({ message, modelIcon }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="flex flex-col items-end" style={{ maxWidth: '72%' }}>
          <div
            style={{
              background: '#E8580C',
              color: '#fff',
              borderRadius: '16px 16px 4px 16px',
              padding: '10px 14px',
              fontSize: 13.5,
              lineHeight: 1.6,
              boxShadow: '0 2px 12px rgba(232,88,12,0.25)',
              wordBreak: 'break-word',
            }}
          >
            {message.content.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </div>
          <span style={{ fontSize: 10, marginTop: 4, color: '#A8ACBA' }}>
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5 animate-fade-up">
      {/* Avatar do modelo */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #E8580C, #F97316)',
          fontSize: 15, marginTop: 2,
          boxShadow: '0 2px 8px rgba(232,88,12,0.2)',
        }}
      >
        {modelIcon || '✝'}
      </div>

      {/* Bubble da resposta */}
      <div className="flex flex-col items-start flex-1 min-w-0">
        <div
          className="prose-chat w-full"
          style={{
            background: '#fff',
            border: '1px solid #E0E3EC',
            borderRadius: '4px 16px 16px 16px',
            padding: '12px 16px',
            fontSize: 13.5,
            lineHeight: 1.7,
            color: '#1a1a1a',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            wordBreak: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(message.content)}</p>` }}
        />
        <span style={{ fontSize: 10, marginTop: 4, color: '#A8ACBA' }}>
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  )
}
