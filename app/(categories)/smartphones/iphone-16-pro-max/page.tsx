import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 16 Pro Max | لمسه للاجهزه الذكيه",
  description: "iPhone 16 Pro Max بأكبر شاشة وأقوى بطارية مع معالج A18 Pro",
};

export default function IPhone16ProMaxPage() {
  return (
    <PhoneHeroPage
      slug="iphone-16-pro-max"
      heroImage="https://res.cloudinary.com/dv6fig2ci/image/upload/v1779497795/iPhone_16_Pro_Desert_Titanium_PDP_Image_Position_5__en-ME-scaled_h1zf9u_mvmggs.avif"
      nameEn="iPhone 16"
      nameEnLine2="Pro Max"
      tagline="القوة القصوى"
      description="iPhone 16 Pro Max يقدم أكبر شاشة آيفون مع معالج A18 Pro وكاميرا بدقة 48 ميجابكسل وبطارية تدوم أطول"
      features={[
        { icon: "chip", label: "معالج A18 Pro" },
        { icon: "camera", label: "كاميرا 48 ميجابكسل" },
        { icon: "battery", label: "أطول عمر بطارية" },
      ]}
    />
  );
}
