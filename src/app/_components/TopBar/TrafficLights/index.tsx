/** Three macOS-style traffic-light circles for the terminal window chrome. */
export default function TrafficLights() {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="block w-[11px] h-[11px] rounded-full bg-[#ff5f56]" aria-hidden="true" />
      <span className="block w-[11px] h-[11px] rounded-full bg-[#ffbd2e]" aria-hidden="true" />
      <span className="block w-[11px] h-[11px] rounded-full bg-[#27c93f]" aria-hidden="true" />
    </div>
  );
}
