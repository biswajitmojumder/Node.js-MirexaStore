"use client";
import WithAuth from "@/app/lib/utils/withAuth";
import React from "react";
import {
  FaDollarSign,
  FaBox,
  FaChartLine,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { useSpring, animated } from "react-spring";

const AnimatedNumber = ({
  spring,
  format,
}: {
  spring: any;
  format: (n: number) => string;
}) => {
  return (
    <animated.span>{spring.number.to((n: number) => format(n))}</animated.span>
  );
};

const AdminAnalytics: React.FC = () => {
  const totalSalesProps = useSpring({
    number: 25340,
    from: { number: 0 },
    config: { tension: 100, friction: 15 },
  });
  const totalOrdersProps = useSpring({
    number: 1235,
    from: { number: 0 },
    config: { tension: 100, friction: 15 },
  });
  const totalProductsSoldProps = useSpring({
    number: 1520,
    from: { number: 0 },
    config: { tension: 100, friction: 15 },
  });
  const avgOrderValueProps = useSpring({
    number: 20.5,
    from: { number: 0 },
    config: { tension: 100, friction: 15 },
  });
  const activeUsersProps = useSpring({
    number: 450,
    from: { number: 0 },
    config: { tension: 100, friction: 15 },
  });
  const topProductProps = useSpring({
    number: 78,
    from: { number: 0 },
    config: { tension: 100, friction: 15 },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Admin Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <Card
          icon={<FaDollarSign className="text-3xl text-blue-600 mr-4" />}
          label="Total Sales"
          color="text-blue-600"
        >
          <AnimatedNumber
            spring={totalSalesProps}
            format={(n) => `৳ ${n.toFixed(0)}`}
          />
        </Card>

        {/* Total Orders */}
        <Card
          icon={<FaBox className="text-3xl text-green-600 mr-4" />}
          label="Total Orders"
          color="text-green-600"
        >
          <AnimatedNumber
            spring={totalOrdersProps}
            format={(n) => `${n.toFixed(0)}`}
          />
        </Card>

        {/* Total Products Sold */}
        <Card
          icon={<FaTrophy className="text-3xl text-yellow-600 mr-4" />}
          label="Total Products Sold"
          color="text-yellow-600"
        >
          <AnimatedNumber
            spring={totalProductsSoldProps}
            format={(n) => `${n.toFixed(0)}`}
          />
        </Card>

        {/* Average Order Value */}
        <Card
          icon={<FaChartLine className="text-3xl text-red-600 mr-4" />}
          label="Avg Order Value"
          color="text-red-600"
        >
          <AnimatedNumber
            spring={avgOrderValueProps}
            format={(n) => `৳ ${n.toFixed(2)}`}
          />
        </Card>

        {/* Active Users */}
        <Card
          icon={<FaUsers className="text-3xl text-purple-600 mr-4" />}
          label="Active Users"
          color="text-purple-600"
        >
          <AnimatedNumber
            spring={activeUsersProps}
            format={(n) => `${n.toFixed(0)}`}
          />
        </Card>

        {/* Top Products */}
        <Card
          icon={<FaTrophy className="text-3xl text-orange-600 mr-4" />}
          label="Top Products"
          color="text-orange-600"
        >
          <AnimatedNumber
            spring={topProductProps}
            format={(n) => `${n.toFixed(0)}`}
          />
        </Card>
      </div>
    </div>
  );
};

const Card = ({
  icon,
  label,
  children,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  color: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold text-gray-700">{label}</h2>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{children}</p>
    </div>
  );
};

const ProtectedPage: React.FC = () => {
  return (
    <WithAuth requiredRoles={["admin"]}>
      <AdminAnalytics />
    </WithAuth>
  );
};

export default ProtectedPage;
