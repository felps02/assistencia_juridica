import { AdminRequestDetail } from "@/components/AdminRequestDetail";

export default async function AdminRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminRequestDetail id={id} />;
}

