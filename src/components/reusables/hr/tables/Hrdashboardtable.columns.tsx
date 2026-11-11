// hrDashboardTableColumns.tsx
// Column definitions for all HR Dashboard Analytics tables

import type { ColumnDef } from "@tanstack/react-table";
import type {
  ITableEmployeesWithHighAbsenteeism,
  ITablePendingLeaveRequests,
  ITableContractsEndingSoon,
  ITableCertificationExpiryAlerts,
} from "./Hrdashboardtables.types";

// ============================================================================
// Table #28: Employees with High Absenteeism
// ============================================================================

export const employeesWithHighAbsenteeismColumns: ColumnDef<ITableEmployeesWithHighAbsenteeism>[] =
  [
    {
      accessorKey: "employee_NAME",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("employee_NAME")}
        </div>
      ),
    },
    {
      accessorKey: "branch",
      header: "Branch",
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue("branch")}</div>
      ),
    },
    {
      accessorKey: "job",
      header: "Job/Department",
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue("job")}</div>
      ),
    },
    {
      accessorKey: "days_ABSENT",
      header: "Days Absent",
      cell: ({ row }) => {
        const daysAbsent = row.getValue("days_ABSENT") as number;

        // Color code by severity
        let colorClass = "text-gray-900";
        if (daysAbsent >= 20) {
          colorClass = "text-red-700 font-semibold";
        } else if (daysAbsent >= 10) {
          colorClass = "text-amber-700 font-semibold";
        }

        return <div className={colorClass}>{daysAbsent}</div>;
      },
    },
    {
      accessorKey: "total_WORK_DAYS",
      header: "Total Work Days",
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue("total_WORK_DAYS")}</div>
      ),
    },
    {
      accessorKey: "attendance_RATE",
      header: "Attendance Rate",
      cell: ({ row }) => {
        const rateString = row.getValue("attendance_RATE") as string;
        const rate = parseFloat(rateString.replace("%", ""));

        // Color code by attendance rate
        let colorClass = "text-gray-700";
        let bgClass = "bg-gray-100";

        if (rate >= 95) {
          colorClass = "text-green-700";
          bgClass = "bg-green-100";
        } else if (rate >= 85) {
          colorClass = "text-blue-700";
          bgClass = "bg-blue-100";
        } else if (rate >= 75) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
        } else {
          colorClass = "text-red-700";
          bgClass = "bg-red-100";
        }

        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${colorClass} ${bgClass}`}
          >
            {rateString}
          </span>
        );
      },
    },
  ];

// ============================================================================
// Table #29: Pending Leave Requests
// ============================================================================

export const pendingLeaveRequestsColumns: ColumnDef<ITablePendingLeaveRequests>[] =
  [
    {
      accessorKey: "employee_Name",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("employee_Name")}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Leave Type",
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "start_Date",
      header: "Start Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("start_Date") as string;
        const date = new Date(dateStr);

        const formatted = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div className="text-gray-700">{formatted}</div>;
      },
    },
    {
      accessorKey: "end_Date",
      header: "End Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("end_Date") as string;
        const date = new Date(dateStr);

        const formatted = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div className="text-gray-700">{formatted}</div>;
      },
    },
    {
      accessorKey: "days",
      header: "Duration (Days)",
      cell: ({ row }) => {
        const days = row.getValue("days") as number;
        return (
          <div className="font-medium text-gray-900">{days.toFixed(1)}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        // Color code by status
        let colorClass = "text-gray-700";
        let bgClass = "bg-gray-100";

        const normalizedStatus = status?.toLowerCase();

        if (
          normalizedStatus?.includes("pending") ||
          normalizedStatus?.includes("waiting")
        ) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
        } else if (
          normalizedStatus?.includes("approved") ||
          normalizedStatus?.includes("accepted")
        ) {
          colorClass = "text-green-700";
          bgClass = "bg-green-100";
        } else if (
          normalizedStatus?.includes("rejected") ||
          normalizedStatus?.includes("denied")
        ) {
          colorClass = "text-red-700";
          bgClass = "bg-red-100";
        }

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "approver_Email",
      header: "Approver",
      cell: ({ row }) => {
        const email = row.getValue("approver_Email") as string;
        return <div className="text-sm text-gray-700">{email}</div>;
      },
    },
  ];

// ============================================================================
// Table #30: Contracts Ending Soon
// ============================================================================

export const contractsEndingSoonColumns: ColumnDef<ITableContractsEndingSoon>[] =
  [
    {
      accessorKey: "employee_Name",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("employee_Name")}
        </div>
      ),
    },
    {
      accessorKey: "emp_Group",
      header: "Employee Group",
      cell: ({ row }) => (
        <div className="text-gray-700">{row.getValue("emp_Group")}</div>
      ),
    },
    {
      accessorKey: "enD_Date",
      header: "Contract End Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("enD_Date") as string;
        const date = new Date(dateStr);

        const formatted = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div className="font-medium text-gray-900">{formatted}</div>;
      },
    },
    {
      accessorKey: "days_Left",
      header: "Days Left",
      cell: ({ row }) => {
        const daysLeftStr = row.getValue("days_Left") as string;
        const daysLeft = parseInt(daysLeftStr);

        // Color code by urgency
        let colorClass = "text-gray-700";
        let bgClass = "bg-gray-100";

        if (daysLeft <= 7) {
          colorClass = "text-red-700";
          bgClass = "bg-red-100";
        } else if (daysLeft <= 30) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
        } else if (daysLeft <= 60) {
          colorClass = "text-blue-700";
          bgClass = "bg-blue-100";
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
            >
              {daysLeft}
            </span>
            <span className="text-xs text-gray-500">
              {daysLeft === 1 ? "day" : "days"}
            </span>
          </div>
        );
      },
    },
  ];

// ============================================================================
// Table #31: Certification Expiry Alerts
// ============================================================================

export const certificationExpiryAlertsColumns: ColumnDef<ITableCertificationExpiryAlerts>[] =
  [
    {
      accessorKey: "employee_Name",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("employee_Name")}
        </div>
      ),
    },
    {
      accessorKey: "certification_ID",
      header: "Certification ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-700">
          {row.getValue("certification_ID")}
        </div>
      ),
    },
    {
      accessorKey: "expiry_Date",
      header: "Expiry Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("expiry_Date") as string;
        const date = new Date(dateStr);

        const formatted = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div className="font-medium text-gray-900">{formatted}</div>;
      },
    },
    {
      accessorKey: "days_Left",
      header: "Days Until Expiry",
      cell: ({ row }) => {
        const daysLeftStr = row.getValue("days_Left") as string;
        const daysLeft = parseInt(daysLeftStr);

        // Color code by urgency
        let colorClass = "text-gray-700";
        let bgClass = "bg-gray-100";
        let icon = "📋";

        if (daysLeft <= 0) {
          colorClass = "text-red-700";
          bgClass = "bg-red-100";
          icon = "❌";
        } else if (daysLeft <= 14) {
          colorClass = "text-red-700";
          bgClass = "bg-red-100";
          icon = "🚨";
        } else if (daysLeft <= 30) {
          colorClass = "text-amber-700";
          bgClass = "bg-amber-100";
          icon = "⚠️";
        } else if (daysLeft <= 60) {
          colorClass = "text-blue-700";
          bgClass = "bg-blue-100";
          icon = "⏰";
        }

        const displayText =
          daysLeft <= 0
            ? "Expired"
            : daysLeft === 1
              ? "1 day"
              : `${daysLeft} days`;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}
            >
              <span>{icon}</span>
              <span>{displayText}</span>
            </span>
          </div>
        );
      },
    },
  ];
