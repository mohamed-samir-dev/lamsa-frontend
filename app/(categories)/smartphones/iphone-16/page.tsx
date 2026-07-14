import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 16 | لمسه للاجهزه الذكيه",
  description: "iPhone 16 بتصميم جديد وألوان مميزة وأداء قوي",
};

export default function IPhone16Page() {
  return (
    <PhoneHeroPage
      slug="iphone-16"
      heroImage="https://res.cloudinary.com/dv6fig2ci/image/upload/v1779497909/iPhone_16_Black_PDP_Image_Position_5__en-ME-scaled_o6hv98_wlr9iv.avif"
      nameEn="iPhone 16"
      tagline="ذكاء جديد، تصميم جديد"
      description="iPhone 16 بتصميم عصري وألوان جريئة مع شريحة A18 القوية وكاميرا مطورة لتجربة يومية مثالية"
      features={[
        { icon: "chip", label: "شريحة A18" },
        { icon: "camera", label: "كاميرا 48 ميجابكسل" },
        { icon: "battery", label: "بطارية ذكية" },
      ]}
    />
  );
}
