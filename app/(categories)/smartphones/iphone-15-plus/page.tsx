import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 15 Plus | لمسه للاجهزه الذكيه",
  description: "iPhone 15 Plus بشاشة كبيرة وبطارية قوية وكاميرا 48 ميجابكسل",
};

export default function IPhone15PlusPage() {
  return (
  <PhoneHeroPage
  slug="iphone-15-plus"
  heroImage="/i-16plus.webp"
  nameEn="iPhone 15"
  nameEnLine2="Plus"
  tagline="شاشة أكبر. بطارية تدوم أكثر."
  description="iPhone 15 Plus يجمع بين الشاشة الكبيرة، والأداء السريع بمعالج A16 Bionic، وكاميرا 48MP المتطورة، مع بطارية تدوم طوال اليوم لتمنحك تجربة استخدام استثنائية."
  features={[
    { icon: "display", label: "شاشة Super Retina XDR مقاس 6.7 بوصة" },
    { icon: "camera", label: "كاميرا مزدوجة 48MP" },
    { icon: "chip", label: "معالج A16 Bionic" },
  ]}
/>
  );
}
