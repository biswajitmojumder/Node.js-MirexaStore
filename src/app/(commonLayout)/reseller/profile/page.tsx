"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Axios from "axios";
import { RootState } from "@/app/lib/redux/store";
import Loading from "@/app/loading";

const ProfilePage = () => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await Axios.get(
          "https://mirexa-store-backend.vercel.app/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router]);

  if (loading)
    return (
      <div className="text-center py-10">
        <Loading></Loading>
      </div>
    );
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
        My Profile
      </h1>

      {profile && (
        <div className="bg-white shadow-lg sm:shadow-2xl rounded-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            {/* Profile Image */}
            <div className="flex justify-center sm:justify-start mb-6 sm:mb-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl sm:text-4xl font-bold shadow-md">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <ProfileItem label="Full Name" value={profile.name} />
                <ProfileItem label="Email Address" value={profile.email} />
                <ProfileItem label="Phone Number" value={profile.phone} />
                <ProfileItem label="Address" value={profile.address} />
                <ProfileItem label="Account Role" value={profile.role} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              //   onClick={() => router.push("/edit-profile")}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all text-center"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-base sm:text-lg font-semibold text-gray-800">
      {value || "N/A"}
    </span>
  </div>
);

export default ProfilePage;
