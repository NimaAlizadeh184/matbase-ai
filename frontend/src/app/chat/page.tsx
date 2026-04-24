'use client'

import { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '@/lib/api'
import Link from 'next/link'
import { Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  text: string
  suggestedIds?: number[]
}

const SUGGESTIONS = [
  'What polymer is best for food contact at high temperatures?',
  'Compare PEEK and PPS for chemical resistance',
  'Which polymers are transparent and UV resistant?',
  'I need a flexible polymer for medical tubing, what do you recommend?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const res = await chatWithAI(text)
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: res.reply,
        suggestedIds: res.suggested_material_ids,
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Materials Assistant</h1>
      <p className="text-sm text-gray-500 mb-4">
        Ask anything about polymer materials — selection, comparison, applications, properties.
      </p>

      <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-400 text-sm">Try one of these:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-brand-400 hover:bg-brand-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
              m.role === 'user'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.suggestedIds && m.suggestedIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.suggestedIds.map(id => (
                    <Link
                      key={id}
                      href={`/materials/${id}`}
                      className="text-xs bg-white text-brand-700 border border-brand-300 px-2 py-0.5 rounded-full hover:bg-brand-50 transition-colors"
                    >
                      View material #{id}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={e => { e.preventDefault(); send(input) }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about a polymer material…"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-brand-600 text-white px-5 py-3 rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
