import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  Store,
  Users,
  UserCheck,
  User,
  ShoppingCart,
  Package,
  Tag,
  Shield,
  TrendingUp,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Gift,
  Award,
  UserMinus,
  RotateCcw,
} from "lucide-react";

const CustomerAnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: "2024-01-01 to 2024-12-31",
    branch: "All Branches",
    customerSegment: "All Segments",
    customerType: "All Types",
    gender: "All",
  });

  // Sample data
  const acquisitionData = [
    { month: "Jan", customers: 285 },
    { month: "Feb", customers: 320 },
    { month: "Mar", customers: 395 },
    { month: "Apr", customers: 342 },
    { month: "May", customers: 418 },
    { month: "Jun", customers: 465 },
  ];

  const customerTypes = [
    { name: "Repeat Customers", value: 68, color: "#10b981" },
    { name: "One-Time Buyers", value: 32, color: "#f59e0b" },
  ];

  const spendData = [
    { range: "$0-50", count: 420 },
    { range: "$51-100", count: 680 },
    { range: "$101-200", count: 520 },
    { range: "$201-500", count: 280 },
    { range: "$500+", count: 95 },
  ];

  const visitData = [
    { month: "Jan", visits: 1250 },
    { month: "Feb", visits: 1380 },
    { month: "Mar", visits: 1520 },
    { month: "Apr", visits: 1420 },
    { month: "May", visits: 1680 },
    { month: "Jun", visits: 1750 },
  ];

  const channelData = [
    { channel: "POS", sales: 485 },
    { channel: "Online", sales: 325 },
    { channel: "Delivery", sales: 190 },
  ];

  const topCustomersData = [
    { name: "Mary J.", spend: 3012 },
    { name: "Sarah W.", spend: 2205 },
    { name: "Lisa T.", spend: 2277 },
    { name: "Robert C.", spend: 2173 },
    { name: "David R.", spend: 1541 },
  ];

  const salesmenData = [
    { name: "Jane Smith", customers: 142 },
    { name: "John Doe", customers: 128 },
    { name: "Mike Johnson", customers: 115 },
    { name: "Sarah Wilson", customers: 98 },
    { name: "David Brown", customers: 87 },
  ];

  const FilterSelect = ({ icon: Icon, label, value, options, onChange }) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const KPICard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="rounded-xl shadow-sm border flex-1 border-gray-200 p-4">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col flex-1 justify-between">
          <div className="flex flex-col items-start space-x-2 gap-2 mb-2">
            <Icon size={20} className={`text-${color}-600`} />
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div style={{ width: "100%", height: "300px" }}>{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Customer Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Drive loyalty, retention, and personalized marketing through
            customer insights
          </p>
        </div> */}

        {/* Global Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🧭 Dashboard Filters
          </h2> */}
          <div className="grid grid-cols-5 gap-4">
            <FilterSelect
              icon={Calendar}
              label="Date Range"
              value={filters.dateRange}
              options={[
                "2024-01-01 to 2024-12-31",
                "2024-Q1",
                "2024-Q2",
                "Last 30 Days",
                "Last 7 Days",
              ]}
              onChange={(value) => setFilters({ ...filters, dateRange: value })}
            />
            <FilterSelect
              icon={Store}
              label="Branch / Region"
              value={filters.branch}
              options={[
                "All Branches",
                "Downtown",
                "Mall Plaza",
                "Suburban",
                "Airport",
                "Online",
              ]}
              onChange={(value) => setFilters({ ...filters, branch: value })}
            />
            <FilterSelect
              icon={Users}
              label="Customer Segment"
              value={filters.customerSegment}
              options={["All Segments", "VIP", "Gold", "Silver", "Bronze"]}
              onChange={(value) =>
                setFilters({ ...filters, customerSegment: value })
              }
            />
            <FilterSelect
              icon={UserCheck}
              label="Customer Type"
              value={filters.customerType}
              options={["All Types", "First-time", "Repeat", "Returning"]}
              onChange={(value) =>
                setFilters({ ...filters, customerType: value })
              }
            />
            <FilterSelect
              icon={User}
              label="Gender"
              value={filters.gender}
              options={["All", "Male", "Female", "Other"]}
              onChange={(value) => setFilters({ ...filters, gender: value })}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="flex flex-row gap-4">
          <KPICard
            icon={Users}
            title="Total Active Customers"
            value="8,542"
            // subtitle="Unique customers with purchases"
            color="blue"
          />
          <KPICard
            icon={UserCheck}
            title="New Customers Acquired"
            value="2,225"
            // subtitle="First-time buyers this period"
            color="green"
          />
          <KPICard
            icon={RefreshCw}
            title="Repeat Customer Rate"
            value="68.2%"
            // subtitle="Customers with multiple purchases"
            color="purple"
          />
          <KPICard
            icon={DollarSign}
            title="Average Spend per Customer"
            value="$156.85"
            // subtitle="Revenue ÷ Customer count"
            color="green"
          />
          <KPICard
            icon={TrendingUp}
            title="Average Visits per Customer"
            value="3.2"
            // subtitle="Total transactions ÷ Customers"
            color="blue"
          />
          <KPICard
            icon={AlertTriangle}
            title="Churn Risk Customers"
            value="247"
            // subtitle="Inactive 45+ days"
            color="red"
          />
          <KPICard
            icon={RotateCcw}
            title="High Refund Customers"
            value="89"
            // subtitle="Unusually high return rate"
            color="orange"
          />
          <KPICard
            icon={Gift}
            title="Loyalty Program Enrollment"
            value="74.5%"
            // subtitle="Active customers enrolled"
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Customer Acquisition Trend */}
          <ChartCard title="📈 Customer Acquisition Trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={acquisitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Repeat vs One-Time Buyers */}
          <ChartCard title="🔄 Repeat vs One-Time Buyers">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Customer Spend Distribution */}
          <ChartCard title="💰 Customer Spend Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Customer Visit Frequency */}
          <ChartCard title="📊 Customer Visit Frequency Over Time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Sales by Channel */}
          <ChartCard title="🛒 Sales by Channel">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Returning Customers */}
          <ChartCard title="⭐ Top Returning Customers">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCustomersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Total Spend",
                  ]}
                />
                <Bar dataKey="spend" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* New Customers by Salesman */}
          <ChartCard title="👥 New Customers by Salesman">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesmenData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Customer Cohort Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📅 Customer Cohort Analysis - Retention Rate (%)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Cohort
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Month 0
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Month 1
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Month 2
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Month 3
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">Jan 2024</td>
                  <td className="px-4 py-2 text-center bg-green-100">100%</td>
                  <td className="px-4 py-2 text-center bg-green-200">68%</td>
                  <td className="px-4 py-2 text-center bg-yellow-200">52%</td>
                  <td className="px-4 py-2 text-center bg-orange-200">41%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">Feb 2024</td>
                  <td className="px-4 py-2 text-center bg-green-100">100%</td>
                  <td className="px-4 py-2 text-center bg-green-200">72%</td>
                  <td className="px-4 py-2 text-center bg-yellow-200">55%</td>
                  <td className="px-4 py-2 text-center bg-orange-200">43%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">Mar 2024</td>
                  <td className="px-4 py-2 text-center bg-green-100">100%</td>
                  <td className="px-4 py-2 text-center bg-green-200">70%</td>
                  <td className="px-4 py-2 text-center bg-yellow-200">58%</td>
                  <td className="px-4 py-2 text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💰 Top Customers by Total Spent
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Spent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Transactions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Segment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                      1
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium">Margaret Foster</td>
                  <td className="px-4 py-4 font-bold text-green-600">$8,450</td>
                  <td className="px-4 py-4">42</td>
                  <td className="px-4 py-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      VIP
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4">
                    <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-sm font-bold">
                      2
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium">William Chen</td>
                  <td className="px-4 py-4 font-bold text-green-600">$7,825</td>
                  <td className="px-4 py-4">38</td>
                  <td className="px-4 py-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      VIP
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4">
                    <span className="bg-amber-600 text-white px-2 py-1 rounded-full text-sm font-bold">
                      3
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium">Victoria Rodriguez</td>
                  <td className="px-4 py-4 font-bold text-green-600">$6,980</td>
                  <td className="px-4 py-4">35</td>
                  <td className="px-4 py-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      VIP
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🧲 Frequently Bought Together
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item A
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item B
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Frequency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4">Vitamin D3</td>
                  <td className="px-4 py-4">Calcium Tablets</td>
                  <td className="px-4 py-4 font-bold text-blue-600">245</td>
                </tr>
                <tr>
                  <td className="px-4 py-4">Pain Relief Gel</td>
                  <td className="px-4 py-4">Anti-inflammatory</td>
                  <td className="px-4 py-4 font-bold text-blue-600">189</td>
                </tr>
                <tr>
                  <td className="px-4 py-4">Cough Syrup</td>
                  <td className="px-4 py-4">Throat Lozenges</td>
                  <td className="px-4 py-4 font-bold text-blue-600">167</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsDashboard;
