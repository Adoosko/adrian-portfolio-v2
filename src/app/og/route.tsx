import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Adrian Finik";
  const subtitle = searchParams.get("subtitle") || "Web Developer";

 

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 50px",
          }}
        >
          <h1
            style={{
              fontSize: 100,
              margin: 0,
              fontFamily: '"Boska"',
              fontWeight: 700,
              color: "#000",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 50,
              margin: "20px 0 0",
              fontFamily: '"Boska"',
              fontWeight: 400,
              color: "#333",
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      
    }
  );
}