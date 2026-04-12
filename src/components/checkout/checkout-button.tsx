"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { localizePath, normalizeLocale } from "@/lib/i18n/routing";

type CheckoutButtonProps = {
    priceId?: string;
    mode: "payment" | "subscription";
    source: "donation" | "shop";
    quantity?: number;
    successPath?: string;
    cancelPath?: string;
    className?: string;
    disabledLabel?: string;
    children: React.ReactNode;
};

export function CheckoutButton({
    priceId,
    mode,
    source,
    quantity = 1,
    successPath = "/dashboard",
    cancelPath,
    className,
    disabledLabel = "Not configured",
    children,
}: CheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const activeLocale = normalizeLocale(pathname.split("/").filter(Boolean)[0]);
    const localizedSuccessPath = localizePath(successPath, activeLocale);
    const localizedCancelPath = cancelPath ? localizePath(cancelPath, activeLocale) : undefined;

    const isDisabled = !priceId || isLoading;

    async function handleCheckout() {
        if (!priceId || isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceId,
                    mode,
                    source,
                    quantity,
                    successPath: localizedSuccessPath,
                    cancelPath: localizedCancelPath,
                }),
            });

            if (response.status === 401) {
                router.push(`${localizePath("/login", activeLocale)}?message=Please log in to continue checkout`);
                return;
            }

            const data = (await response.json()) as { url?: string; error?: string };

            if (!response.ok || !data.url) {
                setError(data.error ?? "Unable to start checkout");
                return;
            }

            window.location.assign(data.url);
        } catch {
            setError("Network error while starting checkout");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleCheckout}
                disabled={isDisabled}
                className={className}
            >
                {!priceId ? disabledLabel : isLoading ? "Redirecting..." : children}
            </button>
            {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
        </div>
    );
}
