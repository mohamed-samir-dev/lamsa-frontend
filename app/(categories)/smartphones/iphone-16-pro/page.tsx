import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 16 Pro | لمسه للاجهزه الذكيه",
  description: "iPhone 16 Pro بتصميم تيتانيوم وكاميرا احترافية ومعالج A18 Pro",
};

export default function IPhone16ProPage() {
  return (
    <PhoneHeroPage
      slug="iphone-16-pro"
      heroImage="https://res.cloudinary.com/dv6fig2ci/image/upload/v1779497795/iPhone_16_Pro_Desert_Titanium_PDP_Image_Position_5__en-ME-scaled_h1zf9u_mvmggs.avif"
      nameEn="iPhone 16"
      nameEnLine2="Pro"
      tagline="احترافية في كل تفصيلة"
      description="iPhone 16 Pro بتصميم تيتانيوم أنيق وشاشة Super Retina XDR ومعالج A18 Pro لتجربة لا مثيل لها"
      features={[
        { icon: "chip", label: "معالج A18 Pro" },
        { icon: "camera", label: "نظام كاميرات Pro" },
        { icon: "battery", label: "بطارية تدوم طول اليوم" },
      ]}
    />
  );
}
