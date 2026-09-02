interface PreviewProduct {
    id: number;
    name: string;
    slug: string;
    category: string;
    image: string;
    basePrice: number;
}

export default function CatalogPreviewGrid({ products }: { products: PreviewProduct[] }) {
    if (products.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
                Catalogue preview coming soon.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => (
                <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
                >
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="p-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{p.category}</p>
                        <p className="text-sm font-semibold text-navy truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">From ₹{p.basePrice}/unit</p>
                    </div>
                </div>
            ))}
        </div>
    );
}