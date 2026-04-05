import Link from "next/link";

import { fetchSanity } from "@/lib/sanity/client";
import { HOME_PAGE_QUERY, PRODUCTS_QUERY } from "@/lib/sanity/queries";

export default async function Home() {
    const homePage = await fetchSanity(HOME_PAGE_QUERY, {}, null);
    const products = await fetchSanity(PRODUCTS_QUERY, {}, []);

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-10">
            <h1 className="text-3xl font-bold mb-4">Home Page</h1>
            <section>
                <h2 className="text-xl font-semibold">Home Content</h2>
                <p>{homePage ? JSON.stringify(homePage) : "No content"}</p>
            </section>
            <section className="mt-8">
                <h2 className="text-xl font-semibold">Products</h2>
                <ul>
                    {products.map((product: any) => (
                        <li key={product._id}>
                            <Link href={`/products/${product._id}`}>
                                {product.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
