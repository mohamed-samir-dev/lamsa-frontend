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
      heroImage="https://res.cloudinary.com/dv6fig2ci/image/upload/v1779497908/iphone_15_plus_hero_cf2xnf_d8zqmt.avif"
      nameEn="iPhone 15"
      nameEnLine2="Plus"
      tagline="شاشة أكبر، تجربة أفضل"
      description="iPhone 15 Plus بشاشة 6.7 بوصة Super Retina XDR وبطارية تدوم طوال اليوم مع كاميرا 48 ميجابكسل"
      features={[
        { icon: "battery", label: "بطارية 26 ساعة تشغيل" },
        { icon: "camera", label: "كاميرا 48 ميجابكسل" },
        { icon: "chip", label: "شريحة A16 Bionic" },
      ]}
    />
  );
}
