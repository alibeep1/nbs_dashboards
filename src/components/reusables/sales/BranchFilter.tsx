import { Building, Icon } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import { useEffect, useState } from "react";
import React from "react";
import { createApiClient } from "@/lib/api";
import { useToken } from "@/hooks/useToken";
import { useDebounce } from "@/hooks/useDebounce";

// interface
export interface FilterProps {
  token: string | null;
}

const BranchFilter = ({ token }: FilterProps) => {
  //   const token = useToken();

  const [data, setData] = React.useState([]);
  const [branchOptions, setBranchOptions] = React.useState<
    { value: string; label: string }[]
  >([]);

  const [selectedBranch, setSelectedBranch] = React.useState<
    string | undefined
  >();

  const [searchText, setSearchText] = useState("");

  // Method 1: Using useDebounce hook
  const debouncedSearchText = useDebounce(searchText, 300); // 300ms delay

  useEffect(() => {
    if (!token) return;

    // fetch branch data from API
    const api = createApiClient(token);

    console.log("token ", token);
    api
      .get("/sa/branch")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
      });
  }, [token]);

  useEffect(() => {
    // response schema: branches: [{branchcode, branchname  }]
    // transform to: {value: branchcode, label: branchname}
    if (data) {
      //   console.log("Fetched branches:", data);
      setBranchOptions(data?.branches);
    }
  }, [data]);

  // useEffect(() => {
  //   console.log("Selected branch:", selectedBranch);
  // }, [selectedBranch]);

  // Effect for Method 1 - triggers when debounced value changes
  useEffect(() => {
    if (!token) return;
    const api = createApiClient(token);
    if (debouncedSearchText.trim()) {
      //
      console.log("Debounced search text (Method 1):", debouncedSearchText);

      // fetch branch data from API
      api
        .get("/sa/branch", {
          params: {
            searchColumn: "branchName",
            searchValue: debouncedSearchText,
          },
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching branches:", err);
        });

      // Your search logic here
    } else if (debouncedSearchText === "") {
      api
        .get("/sa/branch")
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching branches:", err);
        });
    }
  }, [debouncedSearchText, token]);
  return (
    <FilterDropdown
      onValueChange={(val) => setSelectedBranch(val)}
      onSearchChange={(val) => setSearchText(val)}
      options={branchOptions}
      placeholder="Select branch..."
      searchPlaceholder="Search branches..."
      icon={Building}
      showAllOption
      allOptionLabel="All Branches"
      allOptionDescription="View data for all branches"
      value={selectedBranch}
      allowClear
      shouldFilter={false}
    />
  );
};

export default BranchFilter;
