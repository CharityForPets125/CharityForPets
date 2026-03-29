import Link from "next/link";

import { SanityImage } from "@/components/sanity/sanity-image";
import { fetchSanity } from "@/lib/sanity/client";
import { HOME_PAGE_QUERY, PRODUCTS_QUERY, SHOP_SETTINGS_QUERY, DONATION_SETTINGS_QUERY } from "@/lib/sanity/queries";

export default function Home() {
    const { data: { homePage } } = fetchSanity(HOME_PAGE_QUERY);
    const { data: { products } } = fetchSanity(PRODUCTS_QUERY);
    const { data: { shopSettings } } = fetchSanity(SHOP_SETTINGS_QUERY);
    const { data: { donationSettings } } = fetchSanity(DONATION_SETTINGS_QUERY);

    return (
        <div>
            <header>
                <h1>Home Page</h1>
            </header>
            <main>
                <section>
                    <h2>Home Page Content</h2>
                    <p>{homePage?.content}</p>
                </section>
                <section>
                    <h2>Products</h2>
                    <ul>
                        {products?.map((product) => (
                            <li key={product._id}>
                                <Link href={`/products/${product._id}`}>
                                    {product.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h2>Shop Settings</h2>
                    <ul>
                        {shopSettings?.map((setting) => (
                            <li key={setting._id}>
                                {setting.name}: {setting.value}
                            </li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h2>Donation Settings</h2>
                    <ul>
                        {donationSettings?.map((setting) => (
                            <li key={setting._id}>
                                {setting.name}: {setting.value}
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}
