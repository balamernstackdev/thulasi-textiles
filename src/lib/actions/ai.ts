'use server';

import prismadb from '@/lib/prisma';

/**
 * AI Heritage Assistant Action
 * 
 * This action handles user queries about products, fabrics, and heritage.
 * In a real-world scenario, this would interface with an LLM (like Google Gemini).
 * For this implementation, we provide a sophisticated "Knowledge Grounded" mock
 * that can be easily connected to Gemini.
 */
export async function askHeritageAssistant(query: string, productId?: string) {
    try {
        // 1. Fetch relevant context if a product ID is provided
        let context = "";
        if (productId) {
            const product = await prismadb.product.findUnique({
                where: { id: productId },
                include: { category: true }
            });
            if (product) {
                context = `Relevant Product DNA: Name: ${product.name}, Fabric: ${product.fabric}, Weave: ${product.weave}, Origin: ${product.origin}. Story: ${product.artisanStory || 'N/A'}.`;
            }
        }

        // 2. Simulate AI Processing (Mock for now, easy to swap with Gemini)
        // In a real implementation, you'd use: 
        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // const result = await model.generateContent([systemPrompt, context, query]);

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

        const lowercaseQuery = query.toLowerCase();
        let response = "";

        if (lowercaseQuery.includes("wedding") || lowercaseQuery.includes("occasion")) {
            response = "For weddings, I highly recommend our Kanchipuram or Banarasi silks. Their high weave density and pure gold/silver zari work make them ideal for grand ceremonies. If it's a summer wedding, consider our lightweight Gadwal silks which offer regal beauty without the weight.";
        } else if (lowercaseQuery.includes("wash") || lowercaseQuery.includes("care")) {
            response = "Most of our heritage weaves, especially Silks and fine Cottons, are delicate. I strongly recommend professional dry cleaning only. Store them in breathable cotton bags and avoid direct sunlight to preserve the vibrant heritage colors.";
        } else if (lowercaseQuery.includes("authentic") || lowercaseQuery.includes("real")) {
            response = "Authenticity is the soul of Thulasi. Every piece comes with a 'Heritage Promise'. You can check for the Silk Mark or Handloom Mark, and our weavers use traditional techniques passed down through generations. Notice the slight irregularities in the weave – that's the signature of a human hand, not a machine.";
        } else {
            response = `Interesting question about "${query}". At Thulasi Textiles, our expertise covers a vast range of Indian handlooms. This specific inquiry touches upon the technical aspects of our craft. Based on our Heritage DNA, our master weavers prioritize fabric purity and traditional weave density for every piece we create.`;
        }

        return {
            success: true,
            data: response,
            isMock: true // Flag to indicate this is currently in offline/mock mode
        };
    } catch (error) {
        console.error('AI Assistant Error:', error);
        return { success: false, error: 'The Heritage Assistant is resting. Please try again later.' };
    }
}
