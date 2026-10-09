import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const themeOptions = ["light", "dark", "system"] as const;

const ThemeSwitch = ({ compact = false }: { compact?: boolean }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="shrink-0" aria-label="Theme preference" disabled />;
  }

  const current = themeOptions.includes(theme as (typeof themeOptions)[number]) ? theme : "system";
  const next = themeOptions[(themeOptions.indexOf(current as (typeof themeOptions)[number]) + 1) % themeOptions.length];
  const Icon = current === "dark" ? Moon : current === "light" ? Sun : Laptop;
  const nextLabel = next === "system" ? "system theme" : `${next} theme`;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="shrink-0"
      aria-label={`Switch to ${nextLabel}`}
      title={`Theme: ${current}`}
      onClick={() => setTheme(next)}
    >
      <Icon className="h-4 w-4" />
      {!compact && <span className="sr-only">Theme: {current}</span>}
    </Button>
  );
};

export default ThemeSwitch;
