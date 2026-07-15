import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "MacBook Air | لمسه للاجهزه الذكيه",
  description:
    "MacBook Air خفيف بشكل مذهل وقوي بشكل لا يصدق مع شريحة Apple Silicon وبطارية تدوم طوال اليوم",
};

export default function MacBookAirPage() {
  return (
    <PhoneHeroPage
      slug="macbook-air"
      heroImage="/ma.webp"
      nameEn="MacBook"
      nameEnLine2="Air"
      tagline="خفيف. قوي. جاهز لكل شيء."
      description="MacBook Air خفيف بشكل مذهل وقوي بشكل لا يصدق مع شريحة Apple Silicon وبطارية تدوم طوال اليوم"
      features={[
        { icon: "battery", label: "بطارية تدوم 18 ساعة" },
        { icon: "chip", label: "شريحة Apple Silicon" },
        { icon: "design", label: "تصميم خفيف ونحيف" },
      ]}
    />
  );
}
