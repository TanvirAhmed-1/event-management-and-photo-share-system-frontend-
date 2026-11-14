export type AvatarThemeKey = "violet" | "navy" | "emerald" | "rose" | "amber";

export const AVATAR_THEMES: Record<
  AvatarThemeKey,
  { label: string; gradient: string; ring: string; swatch: string }
> = {
  violet: {
    label: "Royal Violet",
    gradient: "bg-gradient-to-br from-[#7C3AED] to-[#4C1D95]",
    ring: "ring-[#7C3AED]/30",
    swatch: "bg-[#7C3AED]",
  },
  navy: {
    label: "Midnight Navy",
    gradient: "bg-gradient-to-br from-[#172554] to-[#1E3A8A]",
    ring: "ring-[#172554]/30",
    swatch: "bg-[#172554]",
  },
  emerald: {
    label: "Emerald Jade",
    gradient: "bg-gradient-to-br from-[#10B981] to-[#047857]",
    ring: "ring-emerald-500/30",
    swatch: "bg-emerald-600",
  },
  rose: {
    label: "Crimson Rose",
    gradient: "bg-gradient-to-br from-[#F43F5E] to-[#BE123C]",
    ring: "ring-rose-500/30",
    swatch: "bg-rose-600",
  },
  amber: {
    label: "Imperial Gold",
    gradient: "bg-gradient-to-br from-[#F59E0B] to-[#B45309]",
    ring: "ring-amber-500/30",
    swatch: "bg-amber-500",
  },
};

export function getAvatarTheme(colorKey?: string) {
  if (colorKey && colorKey in AVATAR_THEMES) {
    return AVATAR_THEMES[colorKey as AvatarThemeKey];
  }
  return AVATAR_THEMES.violet;
}
