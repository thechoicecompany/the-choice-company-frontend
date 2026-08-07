interface PromptInput {
  products:  { id: number; name: string; price: number; category: string }[];
  occasion:  string;
  budget:    string;
  quantity:  number;
}

export function buildAIPrompt({ products, occasion, budget, quantity }: PromptInput): string {
  const productList = products
    .map((p) => `- ${p.name} (₹${p.price}/unit, Category: ${p.category})`)
    .join("\n");

  return `You are an expert corporate gifting consultant for The Choice Company, India's premier bulk gifting brand.

A corporate client is building a gift kit with these requirements:
- Occasion: ${occasion}
- Budget per kit: ${budget}
- Order quantity: ${quantity} kits
- Selected products:
${productList}

Your task:
1. Evaluate the selected products for this occasion and budget.
2. Recommend the optimal combination — which products work best together.
3. Suggest 2–3 additional products that would enhance the kit.
4. Give the kit an attractive, memorable name.

Respond ONLY with valid JSON (no markdown, no code fences, no extra text):
{
  "kitName": "Premium Diwali Welcome Kit",
  "recommendation": "2–3 sentence explanation of why this combination works for the occasion and budget",
  "reasoning": "Brief reasoning on product selection and value perception",
  "suggestedAddonNames": ["Dry Fruit Hamper", "Branded Cotton Pouch"],
  "estimatedValue": "₹750 per kit",
  "perceivedValue": "High"
}`;
}
