import { permanentRedirect } from "next/navigation";

type LegacyCategoryPageProps = {
  params: { category: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export default function LegacyCategoryPage({ params }: LegacyCategoryPageProps) {
  permanentRedirect(`/topic/${params.category}`);
}
