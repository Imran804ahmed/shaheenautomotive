import { PageImageManagement } from "../page-image-management";

export default async function WebsitePageImages({ params }: { params: Promise<{ page: string }> }) {
  return <PageImageManagement pageKey={(await params).page} />;
}
