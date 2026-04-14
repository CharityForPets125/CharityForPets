export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8" aria-label="Loading">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-3/4 rounded-2xl bg-amber-100" />
        <div className="h-4 w-1/2 rounded-xl bg-amber-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-amber-50" />
          ))}
        </div>
      </div>
    </main>
  );
}
