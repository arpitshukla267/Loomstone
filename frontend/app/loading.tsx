export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
    >
      {/* Top Progressive Line (Without Shadow) */}
      <div className="fixed top-0 left-0 right-0 z-[100000] h-[3.5px] bg-transparent pointer-events-none">
        <div className="h-full w-full bg-gold animate-[pulse_1.5s_ease-in-out_infinite]" />
      </div>

      {/* Center Blinking Vertical Logo */}
      <div className="relative flex flex-col items-center justify-center px-6">
        <div className="animate-pulse duration-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-vertical.png"
            alt="Loomstone"
            className="h-28 w-auto object-contain md:h-36 drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
