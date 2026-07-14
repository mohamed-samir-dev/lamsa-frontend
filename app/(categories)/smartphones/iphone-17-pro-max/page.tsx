import type { Metadata } from "next";
import PhoneHeroPage from "./PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 17 Pro Max | لمسه للاجهزه الذكيه",
  description:
    "iPhone 17 Pro Max يجمع بين تصميم التيتانيوم الأنيق والأداء الخرافي مع كاميرات احترافية من الجيل الجديد",
};

export default function IPhone17ProMaxPage() {
  return (
    <PhoneHeroPage
      slug="iphone-17-pro-max"
      heroImage="/i17-pro.webp"
      nameEn="iPhone 17 Pro Max"
      tagline="الأقوى والأسرع والأكثر احترافية"
      description="iPhone 17 Pro Max يجمع بين تصميم التيتانيوم الأنيق والأداء الخرافي مع كاميرات احترافية من الجيل الجديد"
    />
  );
}
