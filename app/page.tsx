import { Banner } from "./components/banner";
import { ProductGrid } from "./components/products";
import CustomerReviews from "./components/CustomerReviews";
import ShopByCategory from "./components/ShopByCategory";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const SITE_URL = "https://www.pasmthatfee.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

async function getProducts() {
  try {
    const r = await fetch(
      `${BACKEND}/api/products?fields=name,originalPrice,salePrice,image,images,color,storage,category,subCategory,inStock,freeDelivery,warrantyYears,installment`,
      { next: { revalidate: 60 } }
    );
    return r.ok ? r.json() : [];
  } catch {
    return [];
  }
}

async function getHomeConfig() {
  try {
    const [settingsRes, maxRes] = await Promise.all([
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, { next: { revalidate: 120 } }),
      fetch(`${BACKEND}/api/admin/sub-categories/max`, { next: { revalidate: 120 } }),
    ]);
    const settings = settingsRes.ok ? await settingsRes.json() : [];
    const maxData = maxRes.ok ? await maxRes.json() : { max: 4 };
    return { settings, max: maxData.max ?? 4 };
  } catch {
    return { settings: [], max: 4 };
  }
}

async function getCategoryBanners(categories: string[]) {
  if (!categories.length) return {};
  try {
    const r = await fetch(
      `${BACKEND}/api/admin/category-banners-bulk?categories=${encodeURIComponent(categories.join(","))}`,
      { next: { revalidate: 300 } }
    );
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Home() {
  const [c, products, homeConfig] = await Promise.all([
    getCompany(),
    getProducts(),
    getHomeConfig(),
  ]);

  // Get category banners in parallel after we know the categories
  const categories = [...new Set((products as { category?: string }[]).map((p) => p.category).filter(Boolean))] as string[];
  const bannerMap = await getCategoryBanners(categories);

  const siteName = c.nameAr || "بصمة هاتفي المعتمد";
  const logoUrl = c.logo
    ? (c.logo.startsWith("http") ? c.logo : `${BACKEND}${c.logo}`)
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: c.nameEn || "Pasmthatfee",
    url: SITE_URL,
    logo: logoUrl,
    contactPoint: [
      c.phone && {
        "@type": "ContactPoint",
        telephone: c.phone,
        contactType: "customer service",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
      c.whatsapp && {
        "@type": "ContactPoint",
        telephone: c.whatsapp,
        contactType: "sales",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
    ].filter(Boolean),
    address: c.addressAr ? {
      "@type": "PostalAddress",
      addressLocality: c.addressAr,
      addressCountry: "SA",
    } : undefined,
    email: c.email || undefined,
    sameAs: c.website ? [c.website] : [],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-[#f5f0e8]/30">
        <Banner />
        <ShopByCategory />
        <div id="products">
          <ProductGrid initialProducts={products} initialHomeConfig={homeConfig} initialBannerMap={bannerMap} />
        </div>
        <CustomerReviews />
      </main>
    </>
  );
}
