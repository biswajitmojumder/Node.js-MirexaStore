import ClientAdminWrapper from "./ClientAdminWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <ClientAdminWrapper>{children}</ClientAdminWrapper>
    </div>
  );
}
