"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  checkHealth,
  heroApi,
  productApi,
  whyLoomstoneApi,
  type HeroSlide,
  type Product,
  type WhyLoomstone,
} from "@/lib/api";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clapperboard,
  ExternalLink,
  ArrowUpRight,
  Activity,
  Image as ImageIcon,
  Package,
  Phone,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

/* ───────────────────────────── helpers ───────────────────────────── */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const cleanHeading = (h: string) =>
  (h || "").replace(/\*/g, "").replace(/\\n|\n/g, " ");

/* ───────────────────────────── small UI pieces ───────────────────────────── */

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  tone = "blue",
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ElementType;
  href: string;
  tone?: "blue" | "amber" | "green" | "slate";
}) {
  const tones = {
    blue: "bg-[#EEF4FF] text-[#00355F] border-[#B2CDFA]/50",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Link href={href} className="group">
      <Card className="h-full border-slate-200/80 hover:border-[#B2CDFA] hover:shadow-md transition-all duration-200">
        <CardBody className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {label}
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${tones[tone]}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-[#00355F] transition-colors">
              {value}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">{sub}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

function DonutChart({
  data,
  centerLabel,
}: {
  data: { name: string; value: number; color: string }[];
  centerLabel: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No items yet
      </div>
    );
  }
  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.filter((d) => d.value > 0)}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={3}
            stroke="none"
          >
            {data
              .filter((d) => d.value > 0)
              .map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "#64748B" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 -mt-6 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-slate-900">{total}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────────── page ───────────────────────────── */

export default function DashboardPage() {
  const [health, setHealth] = useState<boolean | null>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [whyData, setWhyData] = useState<WhyLoomstone | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    checkHealth().then(setHealth);

    Promise.all([
      heroApi.list().catch(() => []),
      productApi.list().catch(() => []),
      whyLoomstoneApi.get().catch(() => null),
    ])
      .then(([s, p, w]) => {
        setSlides(s);
        setProducts(p);
        setWhyData(w);
      })
      .finally(() => setLoaded(true));
  }, []);

  const slideStats = useMemo(() => {
    const active = slides.filter((s) => s.isActive).length;
    const sorted = [...slides].sort((a, b) => a.order - b.order);
    return {
      total: slides.length,
      active,
      hidden: slides.length - active,
      sorted,
    };
  }, [slides]);

  const productStats = useMemo(() => {
    const active = products.filter((p) => p.isActive).length;
    return { total: products.length, active, hidden: products.length - active };
  }, [products]);

  const whyFeatureCount = whyData?.features?.length ?? 0;

  const distributionData = [
    { name: "Live Slides", value: slideStats.active, color: "#00355F" },
    { name: "Live Products", value: productStats.active, color: "#10B981" },
    { name: "Why Features", value: whyFeatureCount, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-sm relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#00355F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Loomstone CMS
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Manage your homepage hero banners, products, Why Loomstone section,
            and contact details from one central workspace.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <span
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
              health === null
                ? "bg-slate-50 text-slate-500 border-slate-200"
                : health
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {health === null
              ? "Checking API…"
              : health
                ? "API Online"
                : "API Offline"}
          </span>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00355F] text-white text-xs font-semibold hover:bg-[#0b2640] transition-all shadow-sm shadow-[#00355F]/20"
          >
            Preview Site <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KpiCard
          label="Hero Slides"
          value={loaded ? slideStats.total : "–"}
          sub={`${slideStats.active} live on homepage`}
          icon={Clapperboard}
          href="/dashboard/hero"
          tone="blue"
        />
        <KpiCard
          label="Products"
          value={loaded ? productStats.total : "–"}
          sub={`${productStats.active} designs live`}
          icon={Package}
          href="/dashboard/products"
          tone="green"
        />
        <KpiCard
          label="Why Loomstone"
          value={loaded ? whyFeatureCount : "–"}
          sub="feature highlights"
          icon={Sparkles}
          href="/dashboard/why-loomstone"
          tone="amber"
        />
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hero Slides Preview */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Homepage Hero Slides
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Slides in display order
              </p>
            </div>
            <Link
              href="/dashboard/hero"
              className="text-xs font-semibold text-[#00355F] hover:underline"
            >
              Manage all
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {slideStats.sorted.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                {loaded
                  ? health === false
                    ? "Backend connection offline."
                    : "No hero slides found. Add your first slide."
                  : "Loading…"}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {slideStats.sorted.slice(0, 4).map((s) => {
                  const img = s.image || s.imageUrl;
                  return (
                    <li key={s._id}>
                      <Link
                        href="/dashboard/hero"
                        className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-14 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {cleanHeading(s.heading)}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {s.description || "No description"}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {s.order}
                        </span>
                        <Badge variant={s.isActive ? "success" : "warning"}>
                          {s.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Visibility Chart */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-slate-900 text-base">
              Content Overview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live content distribution
            </p>
          </CardHeader>
          <CardBody className="p-4">
            <DonutChart data={distributionData} centerLabel="Items" />
          </CardBody>
        </Card>
      </div>

      {/* ── Quick Access ── */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Quick Access</h2>
          <span className="text-xs text-slate-400 font-medium">
            Loomstone modules
          </span>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Hero Slides",
                desc: "Homepage banners, headings & buttons",
                icon: Clapperboard,
                href: "/dashboard/hero",
              },
              {
                label: "Products",
                desc: "Manage product designs & imagery",
                icon: Package,
                href: "/dashboard/products",
              },
              {
                label: "Why Loomstone",
                desc: "Feature highlights & section content",
                icon: Sparkles,
                href: "/dashboard/why-loomstone",
              },
              {
                label: "Contact Info",
                desc: "Email, phone, address & social links",
                icon: Phone,
                href: "/dashboard/contactinfo",
              },
            ].map((q) => (
              <Link key={q.label} href={q.href} className="group">
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-[#B2CDFA] transition-all duration-200 flex items-start gap-3.5 h-full">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <q.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-xs group-hover:text-[#00355F] transition-colors truncate">
                        {q.label}
                      </h3>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00355F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {q.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
