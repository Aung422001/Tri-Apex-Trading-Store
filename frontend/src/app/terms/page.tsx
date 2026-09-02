export default function TermsOfServicePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <h1 className="font-display font-[900] text-5xl uppercase tracking-tighter text-navy mb-12 border-l-8 border-orange pl-8">
                Terms of <span className="text-orange">Service</span>
            </h1>
            
            <div className="space-y-12 text-gray-700 leading-relaxed font-body">
                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing triapextrading.com, you agree to comply with these terms. We provide 3D printing hardware, materials, and technical advice "as-is" without warranties beyond standard manufacturer coverage.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">2. Product Liability</h2>
                    <p>
                        3D printing involves high temperatures and machinery. Triapex Trading Group is not liable for damages resulting from improper machine operation, unauthorized modifications, or failure to follow safety guidelines.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">3. Payments & Orders</h2>
                    <p>
                        All prices are in Myanmar Kyat (MMK). We reserve the right to cancel orders due to pricing errors or stock unavailability. The "Secure Simulation Mode" on our payment forms indicates a testing environment; real production payments will be processed via secured industrial gateways.
                    </p>
                </section>

                <section>
                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-navy mb-4">4. Shipping & Returns</h2>
                    <p>
                        Free shipping applies to orders over MMK 800,000. Returns are accepted within 7 days for factory-sealed items. Technical issues should be addressed to our engineering support team via the help center.
                    </p>
                </section>
            </div>
            
            <div className="mt-20 pt-12 border-t border-gray-100 italic text-sm text-gray-400">
                Last Updated: April 21, 2026 · Triapex Trading Group MM
            </div>
        </div>
    )
}
