"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";

const ResellerClientButton = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const handleClick = () => {
    if (user?.email) {
      router.push("/reseller-request");
    } else {
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block bg-white text-[#EA580C] font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition mb-4"
    >
      Become a Reseller
    </button>
  );
};

export default ResellerClientButton;
