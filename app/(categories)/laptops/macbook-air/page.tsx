import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "MacBook Air | لمسه للاجهزه الذكيه",
  description:
    "MacBook Air بتصميم نحيف وخفيف مع أداء استثنائي وشاشة Liquid Retina رائعة",
};

export default function MacBookAirPage() {
  return (
    <PhoneHeroPage
      slug="ma-air"
      heroImage="/mac.webp"
      nameEn="MacBook"
      nameEnLine2="Air"
      tagline="خفيف بشكل مذهل، قوي بشكل لا يُصدق"
      description="MacBook Air بتصميم نحيف وخفيف مع أداء استثنائي وشاشة Liquid Retina رائعة وبطارية تدوم طوال اليوم"
      features={[
        { icon: "battery", label: "بطارية تدوم حتى 18 ساعة" },
        { icon: "chip", label: "شريحة Apple M3" },
        { icon: "display", label: "شاشة Liquid Retina" },
      ]}
    />
  );
}
