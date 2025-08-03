import React from "react";

const SellerValiditySkeleton = () => {
  const skeletonRows = Array(5).fill(0);

  return (
    <div className="overflow-x-auto animate-pulse rounded-md border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Brand",
              "Email",
              "Valid Till",
              "Time Remaining",
              "Adjust Validity (days)",
              "Action",
            ].map((title) => (
              <th
                key={title}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {skeletonRows.map((_, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {Array(6)
                .fill(0)
                .map((__, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    {j === 4 && (
                      <p className="text-xs text-gray-300 mt-1">
                        &nbsp; {/* keeps cell height */}
                      </p>
                    )}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerValiditySkeleton;
