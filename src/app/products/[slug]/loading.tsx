export default function ProductLoading() {
  return (
    <div
      className="container-site grid gap-10 py-12 lg:grid-cols-[1.15fr_0.7fr]"
      aria-label="Loading product"
    >
      <div className="skeleton aspect-[4/5]" />
      <div>
        <div className="skeleton h-4 w-24" />
        <div className="skeleton mt-5 h-16 w-full" />
        <div className="skeleton mt-6 h-6 w-36" />
        <div className="skeleton mt-10 h-12 w-full" />
      </div>
    </div>
  );
}
