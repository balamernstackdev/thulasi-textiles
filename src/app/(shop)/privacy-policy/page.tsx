
export default function PrivacyPolicyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-[1700px] mx-auto px-4 lg:px-6">
                <h1 className="text-4xl font-black text-gray-900 mb-8 border-b-4 border-orange-600 pb-4 inline-block">Privacy Policy</h1>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, postal address, phone number, and payment information.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to process transactions and send related information, and to communicate with you about products, services, and offers.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">3. Sharing of Information</h2>
                        <p>We do not share your personal information with third parties except as described in this policy, such as with vendors who perform services for us or in response to a legal request.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">4. Security</h2>
                        <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>
                    </section>

                    <p className="text-sm font-medium mt-12 bg-gray-50 p-6 rounded-xl border-l-4 border-orange-500 italic">
                        Note: This is a placeholder document. Official privacy policy will be provided by the legal department.
                    </p>
                </div>
            </div>
        </div>
    );
}
