/** Product brand identity element shown at the very top of the landing page. */
export default function Wordmark() {
  return (
    <div className="flex flex-col items-center text-center pt-16 sm:pt-24 pb-4 px-4">
      <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter text-zinc-100">
        AIDEMD
      </h1>
      <p className="text-lg sm:text-xl text-zinc-500 tracking-wide">
        Code is ephemeral. Intent is law.
      </p>
    </div>
  );
}
