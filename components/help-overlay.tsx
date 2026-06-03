"use client"

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"
import { usePlayer, type Theme } from "@/contexts/player-context"
import { cn } from "@/lib/utils"

export function HelpOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = usePlayer()

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          "backdrop-blur-md border border-white/20",
          "hover:bg-white/10 active:bg-white/20",
          theme === "pink"
            ? "bg-pink-300/20 hover:bg-pink-300/30"
            : "bg-white/5 hover:bg-white/10"
        )}
        aria-label="Help"
        title="How It Works"
      >
        <HelpCircle className="w-5 h-5 text-white/70" />
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        />
      )}

      {/* Help Modal */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4",
            "animate-in fade-in duration-300"
          )}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={cn(
              "w-full max-w-2xl max-h-[80vh] rounded-2xl",
              "backdrop-blur-xl border border-white/20",
              "overflow-y-auto",
              "animate-in scale-in duration-300",
              theme === "pink"
                ? "bg-pink-950/40"
                : "bg-black/60"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn(
              "sticky top-0 flex items-center justify-between p-6 border-b border-white/10",
              theme === "pink"
                ? "bg-pink-950/60"
                : "bg-black/80"
            )}>
              <h1 className="text-2xl font-semibold text-white">How It Works</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">How to Add MP3 & Lyrics</h2>
                <div className="space-y-3 text-white/80 text-sm leading-relaxed">
                  <p>• Upload MP3 to instantly start playing music.</p>
                  <p>• You can:</p>
                  <div className="ml-4 space-y-2">
                    <p>  * upload single songs</p>
                    <p>  * upload folder playlists</p>
                    <p>  * upload lyrics files</p>
                    <p>  * paste lyrics manually</p>
                    <p>  * add album covers</p>
                    <p>  * select album covers from your recent cover uploads</p>
                  </div>
                  <p>• If you want MP3 downloading apps/websites and detailed guides, check my Instagram highlights for it.</p>
                  <p>• I know MP3 format feels old and takes up storage, but trust me — once you start using the player this way, the experience feels completely different 🫶🏼</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Section 2 */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">How This Player Works</h2>
                <div className="space-y-3 text-white/80 text-sm leading-relaxed">
                  <p>• I specifically created this player for creative and aesthetic people who love customizing their own experience.</p>
                  <p>• You can freely choose:</p>
                  <div className="ml-4 space-y-2">
                    <p>  * different themes</p>
                    <p>  * vinyl layouts</p>
                    <p>  * lyrics layouts</p>
                    <p>  * album covers</p>
                    <p>  * your previous album covers</p>
                    <p>  * playlist layouts</p>
                    <p>  * minimal vinyl modes</p>
                  </div>
                  <p>• You can also:</p>
                  <div className="ml-4 space-y-2">
                    <p>  * move the lyrics panel</p>
                    <p>  * move the vinyl player</p>
                    <p>  * resize the vinyl</p>
                    <p>  * create your own immersive setup</p>
                  </div>
                  <p>• The player may feel a little complicated at first, but once you understand it, you&apos;re genuinely going to love the experience.</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Section 3 */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">📱 Mobile Experience</h2>
                <div className="space-y-3 text-white/80 text-sm leading-relaxed">
                  <p>• For the best experience on phones, enable Desktop Site/Desktop Mode in your browser.</p>
                  <p>• Full View and Vinyl + Lyrics layouts usually provide the closest experience to the desktop version of Reviora.</p>
                  <p>• If the layout feels too large or too small on your device, experiment with your browser&apos;s zoom settings if available.</p>
                  <p>• You can further customize the experience using the player controls:</p>
                  <div className="ml-4 space-y-2">
                    <p>  * Move Vinyl Player</p>
                    <p>  * Move Lyrics Panel</p>
                    <p>  * Resize Vinyl</p>
                    <p>  * Change Layouts</p>
                    <p>  * Change Themes</p>
                  </div>
                  <p>• Reviora was designed to be flexible and customizable, so feel free to experiment until the setup feels perfect for your screen and aesthetic.</p>
                  <p>• If you&apos;re using a phone and want the most immersive experience, Desktop Mode is recommended.</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Section 4 */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Why I Made This</h2>
                <div className="space-y-3 text-white/80 text-sm leading-relaxed">
                  <p>• I made this completely free because I always wanted a player like this myself.</p>
                  <p>• As an artistic, aesthetic, creative girl, I downloaded so many apps filled with ads, restrictions, and subscriptions.</p>
                  <p>• So I did what a usual tech girlie would do:</p>
                  <p className="ml-4">  I built my own.</p>
                  <p>• I originally thought about Spotify integration, but I ultimately chose a more personal offline-style experience for this player.</p>
                  <p>• Thank you for being here and using something I created with love 🖤</p>
                  <p>• If you&apos;d like to support my free work:</p>
                  <p className="ml-4">  follow me on Instagram and subscribe on YouTube :)</p>
                  <p className="pt-2">xoxo byeee... enjoy the player!!</p>
                  <p className="text-center text-lg">🖤🖤🖤</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
