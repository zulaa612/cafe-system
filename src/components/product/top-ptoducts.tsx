import { Trophy } from "lucide-react";
import type { Report } from "@/app/admin/reports/types";
import { formatMoney } from "@/app/admin/reports/types";

type Props = {
    products: Report["topProducts"];
};

export default function TopProducts({ products }: Props) {
    return (
        <section className="rounded-2xl border border-[#eee5dc] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <Trophy className="text-[#a36b4d]" size={22} />
                <h2 className="text-xl font-bold">
                    Top Selling Products
                </h2>
            </div>

            {products.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                    No paid sales in this period.
                </p>
            ) : (
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <div
                            key={`${product.productName}-${index}`}
                            className="flex items-center gap-4 border-b border-[#eee5dc] pb-4 last:border-0"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf7f2] font-bold text-[#6d4936]">
                                {index + 1}
                            </span>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold">
                                    {product.productName}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {product.quantity} sold
                                </p>
                            </div>

                            <span className="font-bold">
                                {formatMoney(product.revenue)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}