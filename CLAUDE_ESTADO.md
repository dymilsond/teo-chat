# 🔖 Ponto de Restauração — Teo Chat SaaS
**Data:** 2026-02-25
**Status:** Fase 3 completa, pronto para testar chat e iniciar Fase 4

---

## ✅ O que já está feito

### Fase 1 — Fundação Next.js (COMPLETA)
- Projeto Next.js 16.1.6 + TypeScript + Tailwind v4
- Design system: `--wood-dark #5D4037`, `--amber #FF8C00`, `--gold #FFB74D`
- `lib/prompts.ts` — 5 prompts teológicos migrados
- `lib/models.ts` — metadados dos 5 modelos
- `app/api/chat/route.ts` — streaming SSE com OpenAI gpt-4o
- Componentes de chat: ChatArea, ChatHeader, ChatInput, MessageBubble, WelcomeScreen, TypingIndicator
- Hook `useChat.ts`
- `/chat` funcional

### Fase 2 — Auth Supabase (COMPLETA)
- Projeto Supabase: `ldzptplenoadjapvuvkl` (São Paulo)
- SQL migration executada: tabelas `profiles`, `usage_counters`, `conversations`, `messages` + RLS
- Trigger `handle_new_user()` com `SECURITY DEFINER SET search_path = public`
- `lib/supabase/client.ts` + `lib/supabase/server.ts`
- `proxy.ts` (Next.js 16 — substitui middleware.ts)
- Páginas `/login` e `/signup` com design completo
- `/auth/callback/route.ts`
- `components/sidebar/UserMenu.tsx`
- `hooks/useUser.ts`
- Signup testado e funcionando (conta criada: edmilson@teochat.com.br)

### Fase 3 — Histórico de Conversas (COMPLETA)
- `app/api/conversations/route.ts` — GET lista / POST cria
- `app/api/conversations/[id]/messages/route.ts` — GET mensagens
- `contexts/ConversationsContext.tsx` — estado global do histórico
- `components/sidebar/ConversationList.tsx` — lista agrupada (Hoje / 7 dias / Anteriores)
- `app/(app)/chat/[id]/page.tsx` — Server Component que carrega conversa do DB
- `hooks/useChat.ts` atualizado — rastreia conversationId, chama onConversationCreated
- `components/chat/ChatArea.tsx` atualizado — aceita onConversationCreated
- `app/(app)/chat/page.tsx` atualizado — atualiza URL via window.history.replaceState
- `components/sidebar/Sidebar.tsx` atualizado — mostra ConversationList
- `app/(app)/layout.tsx` atualizado — envolve com ConversationsProvider
- `/api/chat` atualizado — autentica usuário, cria conversa, salva msgs no DB
- **Build: 0 erros TypeScript ✓**

---

## 🔧 Configurações atuais

### .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://ldzptplenoadjapvuvkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_5PvCFfgk2N64_68R4h9n8w_b3HRM-nu
OPENAI_API_KEY=sk-proj-... (já configurada)
STRIPE_SECRET_KEY=           ← preencher na Fase 5
STRIPE_WEBHOOK_SECRET=       ← preencher na Fase 5
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= ← preencher na Fase 5
STRIPE_PRO_PRICE_ID=         ← preencher na Fase 5
```

### Dev server
- Porta: **3001**
- Comando: `npm run dev -- -p 3001`
- Importante: Tailwind v4 + Turbopack — reiniciar server se CSS não carregar

### Contas de teste
- Email: `edmilson@teochat.com.br`
- Google OAuth: ainda NÃO configurado no Supabase (Fase futura)

---

## 🚧 O que falta fazer

### Fase 4 — Planos + Rate Limiting (PRÓXIMA)
- [ ] `lib/rate-limit.ts` — lógica de limite mensal (10/mês para free)
- [ ] Integrar rate-limit na `/api/chat`
- [ ] Lock de modelos Pro-only (EEP, EMI, EVR, CLI)
- [ ] `components/ui/UpgradeModal.tsx`
- [ ] `components/ui/UsageCounter.tsx`
- [ ] `components/ui/PlanBadge.tsx`
- [ ] `components/ui/LockIcon.tsx`
- [ ] Página `/pricing`

### Fase 5 — Stripe (PENDENTE)
- [ ] Criar produto + price no Stripe Dashboard
- [ ] `app/api/stripe/checkout/route.ts`
- [ ] `app/api/stripe/webhook/route.ts`
- [ ] `app/api/user/plan/route.ts`
- [ ] Botões de upgrade na UI
- [ ] Webhooks: `checkout.session.completed` → plan='pro'
- [ ] Webhooks: `customer.subscription.deleted` → plan='free'

### Fase 6 — Deploy Vercel (PENDENTE)
- [ ] Adicionar todas as env vars no Vercel
- [ ] Configurar URL de callback no Supabase → Authentication → URL Config
- [ ] Configurar URL de webhook no Stripe
- [ ] Teste end-to-end em produção

---

## 📁 Estrutura de arquivos relevantes

```
teo-chat/
├── proxy.ts                          ← middleware Next.js 16
├── contexts/
│   └── ConversationsContext.tsx      ← estado global histórico
├── app/
│   ├── api/
│   │   ├── chat/route.ts             ← streaming + DB
│   │   ├── conversations/route.ts    ← CRUD conversas
│   │   └── conversations/[id]/
│   │       └── messages/route.ts
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx               ← AppShell + ConversationsProvider
│   │   ├── chat/
│   │   │   ├── page.tsx             ← nova conversa
│   │   │   └── [id]/page.tsx        ← conversa existente (Server Component)
│   └── auth/callback/route.ts
├── components/
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── ConversationList.tsx      ← NOVO
│   │   ├── ModelList.tsx
│   │   └── UserMenu.tsx
│   └── chat/
│       ├── ChatArea.tsx
│       ├── ChatHeader.tsx
│       ├── ChatInput.tsx
│       ├── MessageBubble.tsx
│       ├── WelcomeScreen.tsx
│       └── TypingIndicator.tsx
├── hooks/
│   ├── useChat.ts                    ← atualizado
│   └── useUser.ts
├── lib/
│   ├── supabase/client.ts + server.ts
│   ├── prompts.ts
│   ├── models.ts
│   └── rate-limit.ts                 ← CRIAR na Fase 4
└── types/index.ts
```

---

## ⚠️ Detalhes técnicos importantes

1. **Next.js 16**: `proxy.ts` (não `middleware.ts`) — função `proxy()` sem edge runtime
2. **Supabase trigger**: `SECURITY DEFINER SET search_path = public` — obrigatório
3. **Tailwind v4**: `@import "tailwindcss"` no globals.css — classes fora de @layer funcionam
4. **Streaming chat**: `ReadableStream` Web API — salva assistente DEPOIS do stream no `finally`
5. **URL update**: `window.history.replaceState` após primeira mensagem (sem re-render)
6. **ConversationsContext**: provider no AppLayout, hook usado em Sidebar e ChatPage

---

## 🧪 Para testar após retomar

1. `npm run dev -- -p 3001` (ou outra porta se 3001 ocupada)
2. Navegar para `http://localhost:3001`
3. Login com `edmilson@teochat.com.br`
4. Enviar mensagem → verificar se aparece na sidebar após resposta
5. Clicar na conversa na sidebar → verificar se recarrega corretamente
6. Verificar no Supabase Dashboard → Tables → `conversations` e `messages`
