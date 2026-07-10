/**
 * Marquee — Infinite horizontal outline text marquee banner
 * adopts Cynthia Ugwu's styling language for visual accents
 */
export default function Marquee({ text = "SOFTWARE ENGINEER · MERN DEVELOPER · OPEN TO OPPORTUNITIES ·" }) {
  // Repeat the text several times to make it continuous
  const repetitions = Array(6).fill(text);

  return (
    <div className="w-full py-8 border-y border-white/10 bg-black marquee-container select-none" aria-hidden="true">
      <div className="marquee-content">
        {repetitions.map((item, index) => (
          <span key={index} className="text-outline-marquee flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
