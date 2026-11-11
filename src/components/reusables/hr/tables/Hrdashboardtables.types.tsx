// HrDashboardTables.types.ts
// Type definitions for HR Dashboard Analytics tables

/**
 * Table #28: Employees with High Absenteeism
 * Shows employees with concerning attendance rates
 */
export interface ITableEmployeesWithHighAbsenteeism {
  employee_NAME: string;
  attendance_RATE: string; // Formatted as percentage string
  days_ABSENT: number;
  total_WORK_DAYS: number;
  branch: string;
  job: string;
}

/**
 * Table #29: Pending Leave Requests
 * Shows leave requests awaiting approval
 */
export interface ITablePendingLeaveRequests {
  employee_Name: string;
  start_Date: string; // ISO date string
  end_Date: string; // ISO date string
  type: string; // Leave type
  days: number; // Duration in days
  status: string; // Request status
  approver_Email: string;
}

/**
 * Table #30: Contracts Ending Soon
 * Shows employee contracts nearing expiration
 */
export interface ITableContractsEndingSoon {
  employee_Name: string;
  emp_Group: string; // Employee group/classification
  enD_Date: string; // ISO date string
  days_Left: string; // Days until expiry
}

/**
 * Table #31: Certification Expiry Alerts
 * Shows certifications nearing expiration
 */
export interface ITableCertificationExpiryAlerts {
  employee_Name: string;
  certification_ID: string;
  expiry_Date: string; // ISO date string
  days_Left: string; // Days until expiry
}

/**
 * Generic paginated API response wrapper
 * All table endpoints return data in this structure
 */
export interface PaginatedApiResponse<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Type aliases for specific paginated responses
 * These make the GenericDataTable usage cleaner
 */
export type ITableEmployeesWithHighAbsenteeismApiResponse =
  PaginatedApiResponse<ITableEmployeesWithHighAbsenteeism>;

export type ITablePendingLeaveRequestsApiResponse =
  PaginatedApiResponse<ITablePendingLeaveRequests>;

export type ITableContractsEndingSoonApiResponse =
  PaginatedApiResponse<ITableContractsEndingSoon>;

export type ITableCertificationExpiryAlertsApiResponse =
  PaginatedApiResponse<ITableCertificationExpiryAlerts>;
