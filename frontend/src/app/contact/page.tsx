'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle, Star } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '', rating: 5 })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { data } = await api.post('/feedback', formData)
            if (data.success) {
                toast.success('Thank you for your feedback!')
                setFormData({ name: '', email: '', message: '', rating: 5 })
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to send feedback.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-enter">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl font-bold text-primary mb-3">Feedback & Contact</h1>
                    <p className="text-gray-500 max-w-md mx-auto">Have a question or feedback? We&apos;d love to hear from you. Our team is ready to help.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact form */}
                    <div className="card p-8">
                        <h2 className="text-xl font-bold text-primary mb-6">Send Customer Feedback</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" placeholder="you@email.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} type="button" 
                                            onClick={() => setFormData({...formData, rating: star})}
                                            className="focus:outline-none"
                                        >
                                            <Star className={`w-6 h-6 ${formData.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Message</label>
                                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="input-field min-h-[120px] resize-none" placeholder="Tell us about your experience..."></textarea>
                            </div>
                            
                            <button disabled={loading} className="btn-primary w-full disabled:opacity-50">
                                {loading ? 'Sending...' : 'Submit Feedback'}
                            </button>
                        </form>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-6">
                        {[
                            { icon: <MapPin className="w-5 h-5 text-accent" />, title: 'Visit Us', lines: ['No.612, Shin Htwe Nyo Street, Maung Makan Thar Main Road', 'East Dagon Township, Yangon, Myanmar'] },
                            { icon: <Phone className="w-5 h-5 text-accent" />, title: 'Call Us', lines: ['+95 944 999 7080'] },
                            { icon: <Mail className="w-5 h-5 text-accent" />, title: 'Email Us', lines: ['kht@triapextradinggroupmm.com'] },
                            { icon: <Clock className="w-5 h-5 text-accent" />, title: 'Business Hours', lines: ['Mon–Fri: 9:00 AM – 6:00 PM'] },
                        ].map((item) => (
                            <div key={item.title} className="card p-5 flex items-start gap-4">
                                <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                                    {item.lines.map((line) => <p key={line} className="text-sm text-gray-500">{line}</p>)}
                                </div>
                            </div>
                        ))}

                        {/* FAQ */}
                        <div className="card p-6">
                            <h3 className="font-bold text-primary mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-accent" /> Frequently Asked</h3>
                            {[
                                { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery for unused items.' },
                                { q: 'Do you ship internationally?', a: 'Currently, we ship within Myanmar. International shipping coming soon!' },
                                { q: 'Do you offer warranty?', a: 'Yes, all printers come with a minimum 1-year manufacturer warranty.' },
                            ].map((faq) => (
                                <div key={faq.q} className="mb-3 last:mb-0">
                                    <p className="text-sm font-medium text-gray-800">{faq.q}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
