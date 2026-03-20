'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import api from '@/lib/api'

interface Message {
    role: 'user' | 'model'
    text: string
}

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hi! I'm Tribot 🤖 — your Triapex assistant. I can help with product info, orders, and technical support. How can I help?" },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const quickReplies = ['Find a printer', 'Track order', 'Return policy']

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function sendMessage(text: string) {
        if (!text.trim() || loading) return

        const userMsg: Message = { role: 'user', text: text.trim() }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const { data } = await api.post('/ai/chat', {
                message: text.trim(),
                history: messages.map((m) => ({ role: m.role, text: m.text })),
            })

            if (data.success) {
                setMessages((prev) => [...prev, { role: 'model', text: data.data.reply }])
            } else {
                setMessages((prev) => [...prev, { role: 'model', text: "Sorry, I'm having trouble right now. Please try again or email kht@triapextradinggroupmm.com." }])
            }
        } catch {
            setMessages((prev) => [...prev, { role: 'model', text: "I'm currently offline. Please contact kht@triapextradinggroupmm.com for assistance." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-700 rotate-0' : 'bg-accent hover:bg-accent-600 animate-bounce hover:animate-none'
                    }`}
                style={{ animationDuration: '2s' }}
            >
                {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in flex flex-col" style={{ height: '520px' }}>
                    {/* Header */}
                    <div className="gradient-primary p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-white font-semibold text-sm">Tribot 🤖</div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-white/70 text-xs">Online</span>
                            </div>
                        </div>
                        <Sparkles className="w-4 h-4 text-accent ml-auto" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-accent text-white rounded-br-md'
                                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-md'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-7 h-7 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <User className="w-3.5 h-3.5 text-accent" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-2">
                                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick replies */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-50">
                            {quickReplies.map((qr) => (
                                <button
                                    key={qr}
                                    onClick={() => sendMessage(qr)}
                                    className="px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-full hover:bg-accent/20 whitespace-nowrap transition-colors"
                                >
                                    {qr}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                            className="flex gap-2"
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white hover:bg-accent-600 disabled:opacity-40 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
