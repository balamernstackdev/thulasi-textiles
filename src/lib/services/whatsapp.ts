
export const WhatsappService = {
    /**
     * Simulate sending a WhatsApp message via a provider like Twilio or Interakt
     */
    async sendMessage(to: string, templateName: string, parameters: any) {
        // In a real implementation, this would call the 3rd party API
        const message = `[WHATSAPP MOCK] Sending template '${templateName}' to ${to} with params: ${JSON.stringify(parameters)}`;
        console.log(message);

        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, messageId: `mock_wa_${Date.now()}` };
    },

    async sendOrderConfirmation(phone: string, orderId: string, amount: number, customerName: string) {
        return this.sendMessage(phone, 'order_confirmation', {
            1: customerName,
            2: orderId,
            3: `₹${amount.toLocaleString()}`,
            4: 'Thulasi Textiles'
        });
    },

    async sendShippingUpdate(phone: string, orderId: string, trackingNumber: string, carrier: string) {
        return this.sendMessage(phone, 'shipping_update', {
            1: orderId,
            2: carrier,
            3: trackingNumber
        });
    },

    /**
     * Generate a deep link for customers to chat with support/artisan
     */
    generateChatLink(text: string = 'Hi Thulasi Textiles, I have a query about a product.') {
        const phoneNumber = '919876543210'; // Replace with actual support number
        const encodedText = encodeURIComponent(text);
        return `https://wa.me/${phoneNumber}?text=${encodedText}`;
    }
};
