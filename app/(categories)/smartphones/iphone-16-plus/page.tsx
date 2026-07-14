import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 16 Plus | لمسه للاجهزه الذكيه",
  description: "iPhone 16 Plus بشاشة أكبر وبطارية أقوى وأداء مميز",
};

export default function IPhone16PlusPage() {
  return (
    <PhoneHeroPage
      slug="iphone-16-plus"
      heroImage="https://res.cloudinary.com/dv6fig2ci/image/upload/v1779497909/iPhone_16_Black_PDP_Image_Position_5__en-ME-scaled_o6hv98_wlr9iv.avif"
      nameEn="iPhone 16"
      nameEnLine2="Plus"
      tagline="أكبر شاشة، أطول بطارية"
      description="iPhone 16 Plus يمنحك شاشة أكبر لتجربة مشاهدة رائعة مع بطارية تدوم طوال اليوم وكاميرا مزدوجة متطورة"
      features={[
        { icon: "battery", label: "بطارية عملاقة" },
        { icon: "camera", label: "كاميرا مزدوجة 48MP" },
        { icon: "chip", label: "شريحة A18" },
      ]}
    />
  );
}
