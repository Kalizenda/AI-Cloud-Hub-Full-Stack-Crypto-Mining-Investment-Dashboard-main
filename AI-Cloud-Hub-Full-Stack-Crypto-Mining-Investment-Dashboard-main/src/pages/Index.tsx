import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BarChart3, Check, ChevronRight, CircleDollarSign, Menu, ShieldCheck, Wallet, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatUsd } from "@/lib/currency";
import ThemeSwitch from "@/components/ThemeSwitch";
import { Button } from "@/components/ui/button";

interface CloudPackage {
  id: string;
  name: string;
  description: string | null;
  price_onetime: number | null;
  price_monthly: number | null;
  duration_days: number | null;
  image_url: string | null;
}

const Index = () => {
  const [packages, setPackages] = useState<CloudPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadPackages = async () => {
      const { data, error } = await supabase
        .from("ai_packages")
        .select("id, name, description, price_onetime, price_monthly, duration_days, image_url")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true })
        .limit(3);
      if (cancelled) return;
      setPackagesError(Boolean(error));
      setPackages(data || []);
      setPackagesLoading(false);
    };
    loadPackages();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="app-page-enter min-h-screen overflow-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="ZENDA AI CLOUD CRYPTOCURRENCY MINING home">
            <img src="/logo.webp" alt="" className="h-9 w-9 object-contain" />
            <span className="font-heading text-sm font-bold tracking-tight text-foreground sm:text-base">ZENDA AI CLOUD CRYPTOCURRENCY MINING</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#platform" className="transition-colors hover:text-foreground">Platform</a>
            <a href="#packages" className="transition-colors hover:text-foreground">Packages</a>
            <Link to="/terms" className="transition-colors hover:text-foreground">Terms</Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeSwitch />
            <Link to="/login"><Button variant="ghost" className="font-semibold">Log in</Button></Link>
            <Link to="/register"><Button className="h-10 rounded-lg px-5 font-semibold shadow-sm">Create account <ArrowUpRight className="ml-1 h-4 w-4" /></Button></Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeSwitch compact />
            <Button variant="ghost" size="icon" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">Platform</a>
              <a href="#packages" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">Packages</a>
              <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">Terms</Link>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <Link to="/login"><Button variant="outline" className="w-full">Log in</Button></Link>
                <Link to="/register"><Button className="w-full">Get started</Button></Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section className="relative isolate">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_20%,hsl(var(--primary)/0.12),transparent_40%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
            <div className="max-w-2xl animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                ZENDA AI CLOUD CRYPTOCURRENCY MINING
              </span>
              <h1 className="mt-6 max-w-[14ch] text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.65rem]">
                A clearer way to manage your <span className="text-primary">cloud portfolio.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Explore available computing packages, manage your account balance, and keep track of deposits, withdrawals, and activity from one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register"><Button size="lg" className="h-12 rounded-lg px-6 font-semibold shadow-card">Get started <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
                <a href="#platform"><Button size="lg" variant="outline" className="h-12 rounded-lg px-6 font-semibold">Explore platform</Button></a>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Digital asset and cloud package services involve risk. Review platform terms before participating.</p>
            </div>

            <div className="relative mx-auto w-full max-w-[570px] animate-fade-in [animation-delay:100ms]">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_28px_90px_-48px_hsl(222_47%_11%/0.45)]">
                <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><BarChart3 className="h-5 w-5" /></div>
                    <div><p className="text-sm font-bold text-foreground">Account overview</p><p className="text-xs text-muted-foreground">A snapshot of your activity</p></div>
                  </div>
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold text-success">Sign-in required</span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="rounded-xl bg-secondary p-5 text-secondary-foreground sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/70">Wallet balance</span>
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <p className="mt-3 font-heading text-3xl font-bold tracking-tight tabular-nums">$—</p>
                    <p className="mt-2 text-xs text-white/60">Your account balance appears after sign in</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-background p-4">
                      <p className="text-xs text-muted-foreground">Deposits & withdrawals</p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold"><CircleDollarSign className="h-4 w-4 text-primary" /> Account activity</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4">
                      <p className="text-xs text-muted-foreground">Account protection</p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Sign-in controls</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/70 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Balance and transaction details are account-specific and are shown after authentication.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-border bg-muted/45">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-14">
            {[
              { icon: Wallet, title: "Account overview", detail: "Review balances and activity in one account." },
              { icon: BarChart3, title: "Package marketplace", detail: "See current package options and their details." },
              { icon: ShieldCheck, title: "Clear account controls", detail: "Manage profile, payment details, and requests." },
            ].map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary"><Icon className="h-5 w-5" /></div>
                <div><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="packages" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Explore opportunities</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Available cloud packages</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Browse active packages from the platform. Full details and account actions are available after sign in.</p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View your account <ChevronRight className="h-4 w-4" /></Link>
          </div>

          {packagesLoading ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((key) => <div key={key} className="h-44 animate-pulse rounded-xl border border-border bg-muted/70" />)}
            </div>
          ) : packagesError ? (
            <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-muted-foreground">Package information could not be loaded right now. Please try again later.</div>
          ) : packages.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">There are no active packages to display right now.</div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <article key={pkg.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  {pkg.image_url && <img src={pkg.image_url} alt={pkg.name} loading="lazy" className="h-40 w-full object-cover" />}
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-bold">{pkg.name}</h3>
                    {pkg.description && <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{pkg.description}</p>}
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
                      <div><p className="text-xs text-muted-foreground">{pkg.price_monthly ? "Monthly" : "One-time"} price</p><p className="mt-1 text-xl font-bold tabular-nums">{formatUsd(pkg.price_monthly ?? pkg.price_onetime ?? 0)}</p></div>
                      {pkg.duration_days && <span className="text-xs text-muted-foreground">{pkg.duration_days} days</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8 lg:py-14">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">ZENDA AI CLOUD CRYPTOCURRENCY MINING</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Manage your account with clarity.</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">Create an account to explore the marketplace and access your account dashboard.</p>
            </div>
            <Link to="/register"><Button size="lg" className="h-12 rounded-lg px-6 font-semibold">Create account <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2"><img src="/logo.webp" alt="" className="h-6 w-6 object-contain" /><span className="font-semibold text-foreground">ZENDA AI CLOUD CRYPTOCURRENCY MINING</span><span>© {new Date().getFullYear()}</span></div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#platform" className="hover:text-foreground">Platform</a>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-foreground">Privacy</Link>
            <Link to="/login" className="hover:text-foreground">Log in</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;
