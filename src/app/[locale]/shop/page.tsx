import Link from "next/link";

import { fetchSanity } from "@/lib/sanity/client";
import { PRODUCTS_QUERY, SHOP_SETTINGS_QUERY } from "@/lib/sanity/queries";

import { SanityImage } from "@/components/sanity/sanity-image";

export default function Page({ params }: { params: { locale: string } }) {
    const { locale } = params;

    const [products, setProducts] = useState([]);
    const [shopSettings, setShopSettings] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await fetchSanity(PRODUCTS_QUERY, { locale });
            setProducts(data);
        };

        const fetchShopSettings = async () => {
            const data = await fetchSanity(SHOP_SETTINGS_QUERY, { locale });
            setShopSettings(data);
        };

        fetchProducts();
        fetchShopSettings();
    }, []);

    return (
        <div>
            <h1>{shopSettings.name}</h1>
            <p>{shopSettings.description}</p>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <Link href={`/shop/${product._id}`}>
                            {product.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
