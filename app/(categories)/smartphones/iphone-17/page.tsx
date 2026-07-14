import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 17 | لمسه للاجهزه الذكيه",
  description: "iPhone 17 الجديد بتصميم عصري وأداء قوي وكاميرا مطورة",
};

export default function IPhone17Page() {
  return (
    <PhoneHeroPage
      slug="iphone-17"
      heroImage="https://res.cloudinary.com/dv6fig2ci/image/upload/v1779497909/iPhone_16_Black_PDP_Image_Position_5__en-ME-scaled_o6hv98_wlr9iv.avif"
      nameEn="iPhone 17"
      tagline="الجيل الجديد وصل"
      description="iPhone 17 يجمع بين التصميم العصري والأداء القوي مع كاميرا مطورة وشاشة مذهلة بسعر مناسب"
      features={[
        { icon: "chip", label: "شريحة A18" },
        { icon: "camera", label: "كاميرا 48 ميجابكسل" },
        { icon: "battery", label: "بطارية تكفيك يومك" },
      ]}
    />
  );
}
