import { fetchSanity } from "@/lib/sanity/client";
import { DONATION_SETTINGS_QUERY } from "@/lib/sanity/queries";

import { CheckoutButton } from "@/components/checkout/checkout-button";

export default function Page() {
    const { data } = fetchSanity(DONATION_SETTINGS_QUERY);

    return (
        <div>
            <h1>Donate</h1>
            <CheckoutButton amount={data?.donationSettings?.amount} />
        </div>
    );
}
