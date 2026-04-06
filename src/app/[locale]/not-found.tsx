import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-amber-600">404</p>
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-amber-950 sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-base text-amber-900/85">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
      >
        Go Back Home
      </Link>
    </main>
  );
}
