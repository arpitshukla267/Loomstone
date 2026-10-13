import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-ash text-ink font-sans text-center">
      <span className="text-gold font-bold text-xs tracking-widest uppercase mb-2">
        404 — Page Not Found
      </span>
      <h1 className="text-navy font-manrope font-semibold text-4xl md:text-5xl my-4">
        Page Not Found
      </h1>
      <p className="max-w-md text-cool text-sm leading-relaxed mb-8">
        The piece or page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 bg-navy text-white text-xs font-bold tracking-wider uppercase rounded-full hover:bg-navy/90 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
