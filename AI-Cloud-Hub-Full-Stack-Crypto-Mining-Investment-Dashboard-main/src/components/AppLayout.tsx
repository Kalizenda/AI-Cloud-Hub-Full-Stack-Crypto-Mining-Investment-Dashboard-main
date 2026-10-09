import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Home, Package, ShoppingCart, Users, User, Bell, X, ArrowDownToLine, ArrowUpFromLine, History,
  Coins, Shield, Megaphone, Gift, Rocket
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ThemeSwitch from "@/components/ThemeSwitch";

const typeIcons: Record<string, any> = {
  money: Coins,
  security: Shield,
  system: Megaphone,
  promo: Gift,
  update: Rocket,
};

const bottomNav = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Packages", icon: Package, path: "/packages" },
  { label: "History", icon: History, path: "/transactions" },
  { label: "Team", icon: Users, path: "/team" },
  { label: "My", icon: User, path: "/settings" },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  const [vipLevel, setVipLevel] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [walletRes, unreadRes, recentRes] = await Promise.all([
        supabase.from("wallets").select("total_deposited").eq("user_id", user.id).maybeSingle(),
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false),
        supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);
      const deposited = walletRes.data?.total_deposited ? Number(walletRes.data.total_deposited) : 0;
      const thresholds = [0, 1000, 5000, 15000, 50000, 100000];
      setVipLevel(thresholds.filter((t) => deposited >= t).length - 1);
      setUnreadCount(unreadRes.count || 0);
      setRecentNotifs(recentRes.data || []);

      // Auto-cleanup: delete notifications older than 1 month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      await supabase.from("notifications").delete()
        .eq("user_id", user.id)
        .lt("created_at", oneMonthAgo.toISOString());
    };
    fetchData();
  }, [user, location.pathname]);

  const maskedEmail = user?.email
    ? (() => {
        const [local, domain] = user.email.split("@");
        return local.slice(0, 3) + "***@" + domain;
      })()
    : "user@email.com";

  return (
    <div className="min-h-screen bg-background">
    <div className="min-h-screen bg-background flex flex-col relative lg:flex-row">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <Link to="/dashboard" className="flex h-[72px] items-center gap-3 border-b border-sidebar-border px-6">
          <img src="/logo.webp" alt="" className="h-9 w-9 object-contain" />
          <span className="font-heading text-sm font-bold">AI Cloud Hub</span>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {[
            { label: "Overview", icon: Home, path: "/dashboard" },
            { label: "Packages", icon: Package, path: "/packages" },
            { label: "Deposit", icon: ArrowDownToLine, path: "/deposit" },
            { label: "Withdraw", icon: ArrowUpFromLine, path: "/withdraw" },
            { label: "Transactions", icon: History, path: "/transactions" },
            { label: "Team", icon: Users, path: "/team" },
            { label: "Account", icon: User, path: "/settings" },
          ].map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/55">Secure account workspace</div>
      </aside>
      {/* Shared account header */}
        <div className="min-w-0 flex-1 lg:ml-60">
        <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 h-14 sm:px-6 lg:h-[72px] lg:px-8">
          <div className="flex items-center gap-3">
              {(() => {
                const isGoogleUser = user?.app_metadata?.provider === "google" || user?.app_metadata?.providers?.includes("google");
                const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
                if (isGoogleUser && googleAvatar) {
                  return <img src={googleAvatar} alt="Profile" className="w-9 h-9 rounded-full object-cover" />;
                }
                const initial = (user?.user_metadata?.display_name || user?.email || "U").charAt(0).toUpperCase();
                return (
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {initial}
                  </div>
                );
              })()}
              <span className="text-sm font-medium text-foreground">{maskedEmail}</span>
              <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-[10px] px-1.5 py-0 font-bold">VIP {vipLevel}</Badge>
            </div>
            <div className="ml-auto flex items-center gap-1">
            <ThemeSwitch compact />
            <button
              onClick={() => setShowNotifs(true)}
              aria-label="Open notifications"
              className="relative w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-destructive rounded-full border-2 border-card flex items-center justify-center">
                  <span className="text-[9px] text-destructive-foreground font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </span>
              )}
            </button>
            </div>
          </div>
        </header>

      {/* Notification Modal */}
      {showNotifs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" onClick={() => setShowNotifs(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-sm shadow-neu rounded-2xl bg-card p-5 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-primary" /> Notifications
              </h3>
              <button onClick={() => setShowNotifs(false)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              {recentNotifs.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No notifications</p>}
              {recentNotifs.map((n) => (
                <button
                  key={n.id}
                  onClick={async () => {
                    setSelectedNotif(n);
                    if (!n.is_read) {
                      await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
                      setRecentNotifs(prev => prev.map(notif => notif.id === n.id ? { ...notif, is_read: true } : notif));
                      setUnreadCount(prev => Math.max(0, prev - 1));
                    }
                  }}
                  className={cn(
                    "w-full text-left rounded-xl p-3 space-y-1 transition-colors",
                    !n.is_read
                      ? "bg-primary/5 ring-1 ring-primary/20 border-l-4 border-l-primary shadow-neu"
                      : "shadow-neu-inset bg-muted/20 hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="relative w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {(() => {
                        const Icon = typeIcons[n.type] || Megaphone;
                        return <Icon className="w-4 h-4 text-primary" />;
                      })()}
                      {!n.is_read && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn("text-xs font-heading truncate", !n.is_read ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>{n.title}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">{n.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowNotifs(false); navigate("/notifications"); }}
              className="w-full text-center text-xs font-semibold text-primary py-2 hover:underline"
            >
              See All Notifications →
            </button>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6" onClick={() => setSelectedNotif(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-sm shadow-neu rounded-2xl bg-card p-5 space-y-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {(() => {
                    const Icon = typeIcons[selectedNotif.type] || Megaphone;
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-heading font-bold text-foreground">{selectedNotif.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedNotif.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedNotif(null)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-sm text-foreground leading-relaxed">{selectedNotif.description || "No additional details."}</p>
            </div>
            <p className="text-[10px] text-muted-foreground">{new Date(selectedNotif.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="app-page-enter mx-auto w-full max-w-[1440px] flex-1 px-0 pb-24 sm:px-2 lg:px-8 lg:pb-10">
        {children}
      </main>
        </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 flex justify-center border-t border-border bg-card/95 backdrop-blur-xl safe-area-bottom lg:hidden">
        <div className="flex items-center justify-around h-16 w-full max-w-2xl bg-card">
          {bottomNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-[56px]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", active && "drop-shadow-sm")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </div>
  );
};

export default AppLayout;
