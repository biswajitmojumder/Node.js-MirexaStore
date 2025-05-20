import Header from "@/app/(commonLayout)/components/shared/Header";
import type { Metadata } from "next";
import ClickSparkWrapper from "./components/reactbit/ClickSparkWrapper/ClickSparkWrapper";

export const metadata: Metadata = {
  title: "MirexaStore",
  description:
    "Welcome to MirexaStore – your one-stop destination for all student essentials. From study tools to campus-friendly gadgets, we've got everything you need to power through your academic journey!",
};

export default function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ClickSparkWrapper>
        <Header />
        {children}
      </ClickSparkWrapper>
    </div>
  );
}
