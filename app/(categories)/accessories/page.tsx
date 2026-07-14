import type { Metadata } from "next";
import AccessoriesClient from "./AccessoriesClient";

export const metadata: Metadata = {
  title: "الاكسسوارات | لمسه للاجهزه الذكيه",
  description: "تسوق اكسسوارات الهواتف والأجهزة الذكية بأفضل الأسعار مع شحن سريع وضمان معتمد",
};

export default function AccessoriesPage() {
  return <AccessoriesClient />;
}
