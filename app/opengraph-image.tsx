import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "لمسه للاجهزه الذكيه";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A1825 0%, #122a42 50%, #0A1825 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#BC9255",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            لمسه للأجهزة الذكية
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "rgba(245,240,232,0.8)",
              textAlign: "center",
              direction: "rtl",
              maxWidth: "800px",
            }}
          >
            أجهزة إلكترونية بالأقساط داخل المملكة العربية السعودية
          </div>
          <div
            style={{
              marginTop: "20px",
              fontSize: "24px",
              color: "#BC9255",
              padding: "10px 30px",
              border: "2px solid #BC9255",
              borderRadius: "50px",
            }}
          >
            lamsah-aldhaqiah.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
