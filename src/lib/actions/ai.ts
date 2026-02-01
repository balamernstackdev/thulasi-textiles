'use server';

import prismadb from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Heritage Assistant Action
 * 
 * This action handles user queries about products, fabrics, and heritage.
 * It uses Google Gemini Pro to provide expert responses grounded in Thulasi's catalog.
 */
export async function askHeritageAssistant(query: string, productId?: string) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // Fallback to minimal response if API key is missing
            return {
                success: true,
                data: "The Heritage Assistant is in offline mode. Please configure the GEMINI_API_KEY to enable full expert advice.",
                isMock: true
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Fetch relevant context if a product ID is provided
        let context = "";
        let currentProductSlug = "";
        if (productId) {
            const product = await prismadb.product.findUnique({
                where: { id: productId.includes('-') ? undefined : productId, slug: productId.includes('-') ? productId : undefined },
                include: { category: true }
            });
            if (product) {
                currentProductSlug = product.slug;
                // Fetch some other products from the same category for recommendation context
                const otherProducts = await prismadb.product.findMany({
                    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
                    take: 3,
                    select: { name: true, slug: true, fabric: true }
                });

                context = `
                CURRENT PRODUCT CONTEXT:
                - Name: ${product.name}
                - Slug: ${product.slug}
                - Fabric: ${product.fabric}
                - Weave: ${product.weave}
                - Origin: ${product.origin}
                - Artisan Story: ${product.artisanStory || 'Not specified'}
                - Care Instructions: ${product.careInstructions || 'Dry clean recommended'}

                OTHER RELEVANT PRODUCTS IN THIS CATEGORY:
                ${otherProducts.map(p => `- ${p.name} (Fabric: ${p.fabric}, Slug: ${p.slug})`).join('\n')}
                `;
            }
        }

        const systemPrompt = `
        You are the "Thulasi Heritage Assistant", an expert textile historian and luxury style concierge for Thulasi Textiles.
        Your tone is elegant, respectful of tradition, and highly knowledgeable.
        
        GOALS:
        1. Answer customer queries about Indian heritage weaves, fabrics (Silk, Cotton, Linen), and styling.
        2. If product context is provided, prioritize that specific information.
        3. Advocate for artisanal craftsmanship and the "Heritage Promise" of Thulasi.
        4. Provide fabric care advice (generally recommending professional dry cleaning for luxury pieces).
        5. Encourage the wearer to feel like a "guardian of tradition".
        
        CONSTRAINTS:
        - Keep responses concise but rich in detail (max 3-4 sentences).
        - Use **Markdown** for emphasis (bolding keywords like weave types or care steps).
        - Use bullet points for lists of instructions or options.
        - RECOMMENDING PRODUCTS: When you recommend a specific product from the context provided (either the current one or the other relevant ones), you MUST include its slug in this exact format: [PRODUCT:slug-name]. Place this at the end of your recommendation sentence.
        - If you don't know a specific detail about a product not in context, speak generally about the heritage of its weave type.
        - Avoid technical jargon unless explaining a weave technique (like zari or loom types).
        `;

        const prompt = `${systemPrompt}\n\n${context}\n\nUSER QUERY: ${query}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return {
            success: true,
            data: response,
            isMock: false
        };
    } catch (error) {
        console.error('AI Assistant Error:', error);
        return { success: false, error: 'The Heritage Assistant is currently contemplating a complex weave. Please try again soon.' };
    }
}
