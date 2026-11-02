import Link from "next/link";
import { Activity, BarChart3, Settings, Target, User } from "lucide-react";

/**
 * Defines a single navigation destination.
 */
type NavigationItem = {
  label: string;
  href: string;
  icon: typeof Activity;
};

/**
 * Lists the main sections of the application.
 */
const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Activity },
  { label: "History", href: "/history", icon: BarChart3 },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * Renders the main application navigation.
 *
 * Desktop uses a vertical sidebar.
 * Mobile uses a compact horizontal navigation.
 */
export default function AppNavigation() {
  return (
    <>
      <aside className="hidden min-h-screen w-60 shrink-0 flex-col border-r border-[#e3e9e1] bg-white md:flex">
        <div className="border-b border-[#e3e9e1] px-6 py-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Activity size={23} className="text-[#426c55]" />
            <span className="text-xl font-semibold">WeighIN</span>
          </Link>
        </div>

        <nav aria-label="Main navigation" className="p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#66766c] transition hover:bg-[#f5f7f5] hover:text-[#25372e]"
              >
                <Icon size={19} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <Link
            href="/about"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#66766c] hover:bg-[#f5f7f5]"
          >
            <User size={19} aria-hidden="true" />
            About WeighIN
          </Link>
        </div>
      </aside>

      <div className="border-b border-[#e3e9e1] bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Activity size={22} className="text-[#426c55]" />
            <span className="text-lg font-semibold">WeighIN</span>
          </Link>

          <Link
            href="/settings"
            aria-label="Settings"
            className="rounded-lg p-2 text-[#66766c] hover:bg-[#f5f7f5]"
          >
            <Settings size={20} />
          </Link>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex gap-1 overflow-x-auto px-3 pb-3"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm text-[#66766c] hover:bg-[#f5f7f5]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
