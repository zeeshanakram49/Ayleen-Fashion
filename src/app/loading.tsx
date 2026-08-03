export default function Loading() {
  return (
    <div className="container-site py-12" aria-label="Loading page">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton mt-10 h-16 max-w-2xl" />
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <div className="skeleton aspect-[4/5]" />
            <div className="skeleton mt-4 h-4 w-3/4" />
            <div className="skeleton mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
