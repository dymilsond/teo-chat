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
        const body = rows.slice(2).join('\n') // skip separator row
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
        <div className="flex flex-col items-end">
          <div
            className="max-w-[72%] px-4 py-3 text-sm leading-relaxed"
            style={{
              background: 'linear-gradient(135deg, var(--amber), var(--orange))',
              color: 'var(--white)',
              borderRadius: '15px 15px 4px 15px',
              boxShadow: '0 8px 25px rgba(255,140,0,0.35)',
            }}
          >
            {message.content.split('\n').map((line, i) => (
              <span key={i}>{line}{i < message.content.split('\n').length - 1 && <br />}</span>
            ))}
          </div>
          <span className="text-xs mt-1 opacity-60" style={{ color: 'var(--wood-medium)' }}>
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5 animate-fade-up">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5 border-2"
        style={{
          background: 'linear-gradient(135deg, var(--wood-medium), var(--wood-dark))',
          borderColor: 'var(--amber)',
        }}
      >
        {modelIcon || '✝'}
      </div>
      <div className="flex flex-col items-start flex-1 min-w-0">
        <div
          className="prose-chat w-full text-sm leading-relaxed relative pl-5"
          style={{
            background: 'var(--white)',
            color: 'var(--black-modern)',
            borderRadius: '4px 15px 15px 15px',
            boxShadow: 'var(--shadow-card)',
            padding: '13px 17px 13px 22px',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
          dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(message.content)}</p>` }}
        >
        </div>
        <span className="text-xs mt-1 opacity-60" style={{ color: 'var(--wood-medium)' }}>
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  )
}
