export type Locale = "en" | "cs";

export const strings = {
  en: {
    nav: {
      donate: "Donate",
      shop: "Shop",
      about: "About",
      contact: "Contact",
      dashboard: "Dashboard",
      signOut: "Sign Out",
      logIn: "Log In",
    },
    home: {
      donateNow: "Donate Now",
      shopForACause: "Shop for a Cause",
      featuredProducts: "Featured Products",
      makeAnImpact: "Make an Impact",
      testimonials: "Testimonials",
    },
    donate: {
      title: "Donate",
      description: "Choose an amount to support stray animals.",
      donateOnce: "Donate Once",
      donateMonthly: "Donate Monthly",
    },
    shop: {
      title: "Shop",
      description: "Every purchase helps animals in need.",
    },
    auth: {
      logIn: "Log In",
      welcomeBack: "Welcome back. Sign in to track your impact and manage your donations.",
      email: "Email",
      password: "Password",
      password_min: "At least 8 characters",
      signUp: "Create Account",
      createAccount: "Create your account to donate, shop, and watch your impact grow.",
      continueGoogle: "Continue with Google",
      needAccount: "Need an account? Sign up",
      alreadyHave: "Already have an account? Log in",
      emailRequired: "Email and password are required",
      checkEmail: "Check your email to confirm your account",
      googleError: "Unable to start Google sign-in",
    },
    dashboard: {
      yourDashboard: "Your Dashboard",
      signedInAs: "Signed in as",
      petsHelpedTotal: "Pets Helped (Total)",
      fromDonations: "From Donations",
      fromShopPurchases: "From Shop Purchases",
      recentDonations: "Recent Donations",
      recentOrders: "Recent Orders",
      noDonationsYet: "No donations yet.",
      noOrdersYet: "No orders yet.",
      openStripePortal: "Open Stripe Customer Portal",
    },
    checkout: {
      notConfigured: "Checkout not configured",
      redirecting: "Redirecting to checkout...",
      error: "Checkout failed. Please try again.",
    },
  },
  cs: {
    nav: {
      donate: "Přispívat",
      shop: "Obchod",
      about: "O nás",
      contact: "Kontakt",
      dashboard: "Panel",
      signOut: "Odhlásit se",
      logIn: "Přihlásit se",
    },
    home: {
      donateNow: "Přispět nyní",
      shopForACause: "Koupit na podporu",
      featuredProducts: "Doporučené produkty",
      makeAnImpact: "Udělej rozdíl",
      testimonials: "Recenze",
    },
    donate: {
      title: "Přispívat",
      description: "Vyberte částku na podporu bezdomovných zvířat.",
      donateOnce: "Jednorázový dar",
      donateMonthly: "Měsíční dar",
    },
    shop: {
      title: "Obchod",
      description: "Každý nákup pomáhá zvířatům v nouzi.",
    },
    auth: {
      logIn: "Přihlásit se",
      welcomeBack: "Vítejte zpět. Přihlaste se, abyste sledovali svůj dopad a spravovali své příspěvky.",
      email: "E-mail",
      password: "Heslo",
      password_min: "Nejméně 8 znaků",
      signUp: "Vytvořit účet",
      createAccount: "Vytvořte si účet, abyste mohli přispívat, nakupovat a sledovat svůj dopad.",
      continueGoogle: "Pokračovat s Google",
      needAccount: "Potřebujete účet? Zaregistrujte se",
      alreadyHave: "Máte již účet? Přihlaste se",
      emailRequired: "Email a heslo jsou povinné",
      checkEmail: "Zkontrolujte svůj email pro potvrzení účtu",
      googleError: "Nelze spustit přihlášení Google",
    },
    dashboard: {
      yourDashboard: "Váš panel",
      signedInAs: "Přihlášeni jako",
      petsHelpedTotal: "Zvířat, kterým bylo pomoženo (celkem)",
      fromDonations: "Z darů",
      fromShopPurchases: "Z nákupů v obchodě",
      recentDonations: "Nedávné dary",
      recentOrders: "Nedávné objednávky",
      noDonationsYet: "Dosud žádné dary.",
      noOrdersYet: "Dosud žádné objednávky.",
      openStripePortal: "Otevřít Stripe zákaznický portál",
    },
    checkout: {
      notConfigured: "Checkout není nakonfigurován",
      redirecting: "Přesměrování na checkout...",
      error: "Checkout selhal. Prosím, zkuste znovu.",
    },
  },
} as const;

export function getString(locale: Locale, path: string, defaultValue = ""): string {
  const keys = path.split(".");
  let current: any = strings[locale];

  for (const key of keys) {
    current = current?.[key];
  }

  return current ?? strings.en[path as any] ?? defaultValue;
}
