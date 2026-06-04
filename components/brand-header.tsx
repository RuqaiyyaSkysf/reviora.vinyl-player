export function BrandHeader() {
  return (
    <div className="fixed top-6 left-6 z-40 flex items-center gap-2">
      {/* Minimal brand icon - purple accent */}
      <div
        className="w-6 h-6 rounded-full"
        style={{
          background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
          boxShadow: "0 0 12px rgba(168, 85, 247, 0.3)",
        }}
      />
      {/* Brand text */}
      <span className="text-xs font-semibold tracking-wide text-gray-300 hover:text-white transition-colors">
        REVIORA
      </span>
    </div>
  )
}
