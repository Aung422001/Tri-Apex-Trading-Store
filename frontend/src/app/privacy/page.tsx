export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <h1 className="font-display font-[900] text-5xl uppercase tracking-tighter text-navy mb-12 border-l-8 border-orange pl-8">
                Privacy <span className="text-orange">Policy</span>
            </h1>
            
            <div className="space-y-12 text-gray-700 leading-relaxed font-body">
                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">1. Data Collection</h2>
                    <p>
                        Triapex Trading Group collects personal information strictly necessary for order processing and support. This includes your name, shipping address, email, and phone number. We do NOT store full credit card details on our servers; all payment processing is handled via secure, PCI-compliant third-party gateways.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">2. Technical Usage</h2>
                    <p>
                        We use cookies to maintain your shopping cart and authenticated session. Technical logs are kept for security monitoring and brute-force prevention.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">3. AI Interactions</h2>
                    <p>
                        When interacting with Tribot, our AI assistant, please do not provide sensitive personal identifiers. Query data is processed via Google Gemini API to provide technical support and product recommendations.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">4. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or request deletion of your personal data. Contact us at <span className="font-mono text-orange">support@triapextrading.com</span> for data inquiries.
                    </p>
                </section>
            </div>
            
            <div className="mt-20 pt-12 border-t border-gray-100 italic text-sm text-gray-400">
                Last Updated: April 21, 2026 · Triapex Trading Group MM
            </div>
        </div>
    )
}
