import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function ReportHeader() {
    return (
        <>
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-[#6d4936]">
                        PINECONE COFFEE HOUSE / ADMIN
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        Sales Analytics
                    </h1>
                </div>

                <UserButton />
            </header>

            <nav className="flex gap-5 text-sm">
                <Link href="/admin/products">Products</Link>
                <Link href="/admin/orders">Orders</Link>
            </nav>
        </>
    );
}