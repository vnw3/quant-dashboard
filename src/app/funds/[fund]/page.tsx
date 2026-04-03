import FundPageClient from "./FundPageClient";

export function generateStaticParams() {
  return [
    { fund: "renaissance" },
    { fund: "bridgewater" },
    { fund: "millennium" },
    { fund: "pershing" },
    { fund: "tiger" },
  ];
}

export default async function FundPage({ params }: { params: Promise<{ fund: string }> }) {
  const { fund } = await params;
  return <FundPageClient fundId={fund} />;
}
