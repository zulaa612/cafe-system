import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function ReportHeader() {
    return (
        <>
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-white">
                        PINECONE COFFEE HOUSE / ADMIN
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Sales Analytics
                    </h1>
                </div>

                <UserButton />
            </header>

            <nav className="flex gap-5 text-sm text-white">
                <Link href="/admin/products" className="rounded-xl bg-[#6d4936] px-5 py-3 text-white hover:bg-[#351200]" >Products</Link>
                <Link href="/admin/orders" className="rounded-xl bg-[#6d4936] px-5 py-3 text-white hover:bg-[#351200]">Orders</Link>
            </nav>
        </>
    );
}