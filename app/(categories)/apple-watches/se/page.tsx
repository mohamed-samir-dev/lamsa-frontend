import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "ساعات ابل | لمسه للاجهزه الذكيه",
  description: "ساعات أبل الذكية بتصميم أنيق وميزات صحية متقدمة وأداء استثنائي",
};

export default function AppleWatchSEPage() {
  return (
    <PhoneHeroPage
      slug="se"
      heroImage="/watch.webp"
      nameEn="Apple"
      nameEnLine2="Watch"
      tagline="رفيقك الذكي على معصمك"
      description="ساعات أبل الذكية بتصميم أنيق وميزات صحية متقدمة وأداء استثنائي يواكب يومك"
      features={[
        { icon: "design", label: "تصميم أنيق وخفيف" },
        { icon: "battery", label: "بطارية تدوم طوال اليوم" },
        { icon: "chip", label: "معالج Apple فائق" },
      ]}
    />
  );
}
