import type { Product } from "@/types/product";

export default function ProductStats({
    products,
}: {
    products: Product[];
}) {
    const active = products.filter((p) => p.isAvailable).length;

    const stats = [
        { label: "Total Products", value: products.length },
        { label: "Available", value: active },
        { label: "Unavailable", value: products.length - active },
    ];

    return (
        <section className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-2xl border bg-white p-5"
                >
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>
            ))}
        </section>
    );
}