export function YouBetLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Water ripples */}
        <ellipse cx="50" cy="85" rx="35" ry="8" fill="currentColor" className="text-primary/20 animate-pulse" />
        <ellipse
          cx="50"
          cy="85"
          rx="28"
          ry="6"
          fill="currentColor"
          className="text-primary/30 animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />

        {/* Swan body - elegant curve */}
        <path
          d="M50 75 Q45 65 45 55 Q45 45 48 35 Q50 25 55 20"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          className="text-primary animate-[draw_1.5s_ease-out]"
        />

        {/* Swan neck - graceful S-curve */}
        <path
          d="M55 20 Q60 15 62 12 Q64 8 62 5 Q60 3 58 3 Q55 3 53 5"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          className="text-primary animate-[draw_1.5s_ease-out_0.2s]"
        />

        {/* Swan head */}
        <circle
          cx="58"
          cy="5"
          r="4"
          fill="currentColor"
          className="text-primary animate-[scale-up_0.5s_ease-out_0.8s_both]"
        />

        {/* Beak - orange accent */}
        <path
          d="M60 5 L65 5 L63 6 Z"
          fill="currentColor"
          className="text-accent animate-[scale-up_0.5s_ease-out_0.9s_both]"
        />

        {/* Wing detail - elegant feathers */}
        <path
          d="M48 40 Q40 42 35 45 Q40 43 45 42"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="text-secondary/60 animate-[draw_1s_ease-out_0.5s]"
        />
        <path
          d="M47 50 Q38 52 32 55 Q38 53 44 52"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="text-secondary/60 animate-[draw_1s_ease-out_0.6s]"
        />

        {/* Standing leg - one leg for balance */}
        <line
          x1="50"
          y1="75"
          x2="50"
          y2="85"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary animate-[draw_0.8s_ease-out_0.4s]"
        />

        {/* Reflection in water */}
        <ellipse cx="50" cy="88" rx="15" ry="3" fill="currentColor" className="text-primary/10 animate-pulse" />
      </svg>

      <div className="flex flex-col leading-none">
        <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-[shimmer_3s_infinite] bg-[length:200%_100%]">
          YouBet
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Win Together</span>
      </div>
    </div>
  )
}
