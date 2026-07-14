import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 17 Air | لمسه للاجهزه الذكيه",
  description: "iPhone 17 Air الأنحف والأخف في تاريخ آيفون بتصميم أنيق وأداء سلس",
};

export default function IPhone17AirPage() {
  return (
    <PhoneHeroPage
      slug="iphone-17-air"
      heroImage="/iPhone_Air_Cloud_White_PDP_Image_Position_7__en-ME-scaled(1).avif"
      nameEn="iPhone 17"
      nameEnLine2="Air"
      tagline="خفة لا تُصدق"
      description="iPhone 17 Air أنحف آيفون على الإطلاق بتصميم أنيق وشاشة رائعة وأداء يومي سلس بلا تنازلات"
      features={[
        { icon: "chip", label: "تصميم فائق النحافة" },
        { icon: "camera", label: "كاميرا متقدمة" },
        { icon: "battery", label: "بطارية ذكية" },
      ]}
    />
  );
}
