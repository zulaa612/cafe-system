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
                    className="relative z-10 w-full rounded-2xl border backdrop-blur-md md:p-10 border-white/40 bg-[#] p-5 shadow-2xl"
                >
                    <p className="text-sm text-white">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                </div>
            ))}
        </section>
    );
}