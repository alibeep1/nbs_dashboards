// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { Table } from "@tanstack/react-table";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";

// // import { Button } from "@/registry/new-york-v4/ui/button"
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/registry/new-york-v4/ui/select"

// interface DataTablePaginationProps<TData> {
//   table: Table<TData>;
//   showNumberOfSelectedRows?: boolean;
// }

// export function DataTablePagination<TData>({
//   table,
//   showNumberOfSelectedRows = false,
// }: DataTablePaginationProps<TData>) {
//   return (
//     <div className="flex items-center justify-between px-2">
//       {showNumberOfSelectedRows && (
//         <div className="text-muted-foreground flex-1 text-sm">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//       )}
//       <div className="flex items-center space-x-6 lg:space-x-8">
//         <div className="flex items-center space-x-2">
//           <p className="text-sm font-medium">Rows per page</p>
//           <Select
//             value={`${table.getState().pagination.pageSize}`}
//             onValueChange={(value) => {
//               table.setPageSize(Number(value));
//             }}
//           >
//             <SelectTrigger className="h-8 w-[70px]">
//               <SelectValue placeholder={table.getState().pagination.pageSize} />
//             </SelectTrigger>
//             <SelectContent side="top">
//               {[3, 10].map((pageSize) => (
//                 <SelectItem key={pageSize} value={`${pageSize}`}>
//                   {pageSize}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex w-[100px] items-center justify-center text-sm font-medium">
//           Page {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount()}
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             size="icon"
//             className="hidden size-8 lg:flex"
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <span className="sr-only">Go to first page</span>
//             <ChevronsLeft />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="size-8"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <span className="sr-only">Go to previous page</span>
//             <ChevronLeft />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="size-8"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             <span className="sr-only">Go to next page</span>
//             <ChevronRight />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="hidden size-8 lg:flex"
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage()}
//           >
//             <span className="sr-only">Go to last page</span>
//             <ChevronsRight />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface ServerPaginationProps {
  pageIndex: number; // Current page (0-based)
  pageSize?: number; // Items per page
  totalPages: number; // Total number of pages
  count: number; // Total number of items
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  showNumberOfSelectedRows?: boolean;
  selectedRowsCount?: number;
}

export function DataTablePagination({
  pageIndex,
  pageSize = 5,
  totalPages,
  count,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  showNumberOfSelectedRows = false,
  selectedRowsCount = 0,
}: ServerPaginationProps) {
  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      onPageChange(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(pageIndex + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  const handlePageSizeChange = (value: string) => {
    onPageSizeChange(Number(value));
  };

  return (
    <div className="flex items-center justify-between px-2">
      {showNumberOfSelectedRows && (
        <div className="text-muted-foreground flex-1 text-sm">
          {selectedRowsCount} of {count} row(s) selected.
        </div>
      )}
      <div className="flex justify-between space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 30, 1000].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageIndex} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={handleFirstPage}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={handleNextPage}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={handleLastPage}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
