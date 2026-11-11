import { Layers } from "lucide-react";
import { ExcelStyleFilter } from "./ExcelStyleFilter";

export const GroupableColumnHeader = ({
  column,
  title,
  enableFiltering = true,
  enableGrouping = true,
}: {
  column: any;
  title: string;
  enableFiltering?: boolean;
  enableGrouping?: boolean;
}) => {
  const isGrouped = column.getIsGrouped();
  const canGroup = column.getCanGroup();

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{title}</span>

      <div className="flex items-center gap-1">
        {/* Filter button */}
        {enableFiltering && <ExcelStyleFilter column={column} />}

        {/* Grouping button */}
        {enableGrouping && canGroup && (
          <button
            onClick={() => column.toggleGrouping()}
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${
              isGrouped ? "bg-blue-100 text-blue-600" : "text-gray-500"
            }`}
            title={isGrouped ? "Remove grouping" : "Group by this column"}
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
// Reusable header component
// export const GroupableColumnHeader = ({
//   column,
//   title,
// }: {
//   column: any;
//   title: string;
// }) => {
//   const isGrouped = column.getIsGrouped();
//   const canGroup = column.getCanGroup();

//   return (
//     <div className="flex items-center gap-2">
//       <span className="font-medium">{title}</span>
//       {canGroup && (
//         <button
//           onClick={() => column.toggleGrouping()}
//           className={`p-1 rounded hover:bg-gray-200 transition-colors ${
//             isGrouped ? "bg-blue-100 text-blue-600" : "text-gray-500"
//           }`}
//           title={isGrouped ? "Remove grouping" : "Group by this column"}
//         >
//           <Layers className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// };
