import { ModelMeta } from '@/types'

export const MODELS: Record<string, ModelMeta> = {
  abc: {
    key: 'abc',
    name: 'ABC — Análise Bíblica Completa',
    shortName: 'ABC',
    icon: '📖',
    desc: 'Análise Bíblica Completa — 10 blocos técnicos',
    welcome: 'Pronto para a Análise Bíblica Completa. Digite um versículo ou perícope e receba um estudo técnico nos 10 blocos fixos: exegese, teologia sistemática, autor, destinatários, tema central, contexto histórico, palavras originais, gênero literário, cristocentrismo e contexto canônico.',
    verse: '"Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção..." — 2 Tm 3:16',
    plan: 'free',
  },
  eep: {
    key: 'eep',
    name: 'EEP — Estudo Expositivo Profundo',
    shortName: 'EEP',
    icon: '📚',
    desc: 'Estudo Expositivo Profundo — verso a verso',
    welcome: 'Pronto para o Estudo Expositivo Profundo. Envie uma perícope média ou longa — um bloco de narrativa, parágrafo ou seção inteira — e receba um estudo verso a verso pronto para ser ensinado.',
    verse: '"Sede, porém, praticantes da Palavra, e não somente ouvintes." — Tg 1:22',
    plan: 'pro',
  },
  emi: {
    key: 'emi',
    name: 'EMI — Mente do Inspirado',
    shortName: 'EMI',
    icon: '🧠',
    desc: 'Mente do Inspirado — intenção e emoção do autor',
    welcome: 'Pronto para a Exposição da Mente do Inspirado. Digite um texto com carga emocional ou em que a intenção do autor é determinante, e vamos entrar na mente, urgência e emoção do escritor bíblico.',
    verse: '"Pois nunca qualquer profecia foi dada por vontade humana; entretanto, homens santos falaram da parte de Deus..." — 2 Pe 1:21',
    plan: 'pro',
  },
  evr: {
    key: 'evr',
    name: 'EVR — Estudo Verso Real',
    shortName: 'EVR',
    icon: '🔥',
    desc: 'Estudo Verso Real — devocional diário aplicado',
    welcome: 'Pronto para o Estudo Verso Real. Digite um versículo e receba o devocional completo no formato CENA → VERSO → VERDADE → REALIDADE → RESPOSTA. Sem atalhos — termina em ação concreta.',
    verse: '"A Palavra de Deus é viva e eficaz, mais cortante do que qualquer espada de dois gumes..." — Hb 4:12',
    plan: 'pro',
  },
  cli: {
    key: 'cli',
    name: 'CLI — Contexto do Livro',
    shortName: 'CLI',
    icon: '🗺️',
    desc: 'Contexto do Livro — mapa panorâmico em 13 blocos',
    welcome: 'Pronto para o Contexto do Livro. Digite o nome de um livro bíblico e receba o mapa panorâmico completo em 13 blocos: autor, destinatários, data, contexto histórico, problema central, erros combatidos, mensagem central, temas, palavras-chave, estrutura, versículos-chave, alertas de interpretação e aplicação macro.',
    verse: '"A exposição das tuas palavras ilumina e dá entendimento aos simples." — Sl 119:130',
    plan: 'pro',
  },
}

export const MODEL_LIST = Object.values(MODELS)
