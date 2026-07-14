import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 17 Pro | لمسه للاجهزه الذكيه",
  description: "iPhone 17 Pro بتصميم تيتانيوم متطور وكاميرا احترافية ومعالج A19 Pro",
};

export default function IPhone17ProPage() {
  return (
    <PhoneHeroPage
      slug="iphone-17-pro"
      heroImage="/iPhone_17_Pro_Max_Cosmic_Orange_PDP_Image_Position_7__en-ME-scaled (1).avif"
      nameEn="iPhone 17"
      nameEnLine2="Pro"
      tagline="احترافية بلا حدود"
      description="iPhone 17 Pro يقدم تجربة تصوير استثنائية مع تصميم تيتانيوم خفيف ومعالج A19 Pro لأداء غير مسبوق"
      features={[
        { icon: "camera", label: "كاميرا 48 ميجابكسل" },
        { icon: "chip", label: "معالج A19 Pro" },
        { icon: "battery", label: "بطارية تدوم طول اليوم" },
      ]}
    />
  );
}
