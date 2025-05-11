// components/ResellerProfileCard.tsx

import Image from "next/image";
import Link from "next/link";
import { MdVerified } from "react-icons/md";

type ResellerProfileCardProps = {
  resellerProfile: any;
  resellerRating: { averageRating: number; totalReviews: number } | null;
  isFollowing: boolean;
  followersCount: number;
  handleFollowToggle: () => void;
};

export default function ResellerProfileCard({
  resellerProfile,
  resellerRating,
  isFollowing,
  followersCount,
  handleFollowToggle,
}: ResellerProfileCardProps) {
  if (!resellerProfile) return null;

  // Handle the null case for resellerRating
  const rating = resellerRating ? (
    <>
      <strong>⭐ Rating:</strong> {resellerRating.averageRating ?? "N/A"} (
      {resellerRating.totalReviews ?? 0} reviews)
    </>
  ) : (
    <p>
      <strong>⭐ Rating:</strong> N/A
    </p>
  );

  return (
    <div className="border rounded-2xl p-6 mt-8 shadow-lg bg-white w-full">
      {/* Top Section: Profile Info + Button */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        {/* Left side: Logo + Brand Info */}
        <Link
          href={`/store/${resellerProfile.brand.slug}`}
          className="flex items-center gap-4 flex-1 min-w-0 group"
        >
          {resellerProfile.brand.logo && (
            <Image
              src={resellerProfile.brand.logo}
              alt={resellerProfile.brand.name}
              width={64} // Set width
              height={64} // Set height
              className="rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0 transition-transform group-hover:scale-105"
            />
          )}
          <div className="truncate">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 truncate group-hover:underline">
              {resellerProfile.brand.name}
            </h2>
            <p className="text-gray-500 text-sm truncate group-hover:text-blue-600 transition">
              {resellerProfile.brand.tagline}
            </p>
            {resellerProfile.brand.verified && (
              <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                <MdVerified className="h-4 w-4" />
                <span>Verified Reseller</span>
              </div>
            )}
          </div>
        </Link>

        {/* Right side: Follow/Unfollow + Count */}
        <div className="flex flex-col items-end justify-start gap-1 sm:gap-2 text-right">
          <button
            onClick={handleFollowToggle}
            className={`px-4 py-1 rounded-full text-sm font-medium border ${
              isFollowing
                ? "bg-gray-100 text-gray-800 border-gray-300"
                : "bg-blue-600 text-white border-blue-600"
            } transition`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>

          <p className="text-[11px] sm:text-sm text-gray-600 font-medium tracking-wide">
            <span className="font-semibold text-gray-800">
              👥 {followersCount}
            </span>{" "}
            follower{followersCount !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Description */}
      {resellerProfile.brand.description && (
        <p className="mt-5 text-sm text-gray-700 leading-relaxed">
          {resellerProfile.brand.description}
        </p>
      )}

      {/* Location & Rating */}
      <div className="mt-4 text-sm text-gray-500 space-y-1">
        <p>
          <strong>📍 Location:</strong>{" "}
          {resellerProfile.brand.location || "N/A"}
        </p>
        {rating}
      </div>
    </div>
  );
}
