import type { Metadata } from "next";
import PhoneHeroPage from "../../../components/phones/PhoneHeroPage";

export const metadata: Metadata = {
  title: "iPhone 15 Pro Max | لمسه للاجهزه الذكيه",
  description: "iPhone 15 Pro Max بتصميم تيتانيوم ومعالج A17 Pro وكاميرا احترافية",
};

export default function IPhone15ProMaxPage() {
  return (
    <PhoneHeroPage
      slug="iphone-15-pro-max"
      heroImage="https://res.cloudinary.com/dv6fig2ci/image/upload/v1779497806/iphone-15-pro-max_ecyzxn.png"
      nameEn="iPhone 15"
      nameEnLine2="Pro Max"
      tagline="تيتانيوم. قوة. احتراف."
      description="iPhone 15 Pro Max أول آيفون بتصميم تيتانيوم مع معالج A17 Pro وكاميرا بتقريب بصري 5x لتصوير سينمائي"
      features={[
        { icon: "chip", label: "معالج A17 Pro" },
        { icon: "camera", label: "تقريب بصري 5x" },
        { icon: "battery", label: "بطارية تدوم طول اليوم" },
      ]}
    />
  );
}
