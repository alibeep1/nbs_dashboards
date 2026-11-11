import { Building, Icon, Trees } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import { useEffect, useState } from "react";
import React from "react";
import { createApiClient } from "@/lib/api";
import { useToken } from "@/hooks/useToken";
import { useDebounce } from "@/hooks/useDebounce";
import type { FilterProps } from "./BranchFilter";
import { description } from "../../ui/charts/BarChartComponent";

const ItemGroupFilter = ({ token }: FilterProps) => {
  //   const token = useToken();

  const [data, setData] = React.useState([]);
  const [branchOptions, setBranchOptions] = React.useState<
    { level: string; value: string; label: string; description?: string }[]
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
      .get("/items/tree?level=1")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching Item Groups:", err);
      });
  }, [token]);

  useEffect(() => {
    // response schema: branches: [{branchcode, branchname  }]
    // transform to: {value: branchcode, label: branchname}
    if (data) {
      console.log("Fetched branches:", data);
      // console.log()
      setBranchOptions(data?.dataPoints);
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
        .get("/items/tree?level=1", {
          params: {
            request: debouncedSearchText,
            // searchValue: debouncedSearchText,
          },
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching Item Groups:", err);
        });

      // Your search logic here
    } else if (debouncedSearchText === "") {
      api
        .get("/items/tree?level=1")
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching Item Groups:", err);
        });
    }
  }, [debouncedSearchText, token]);
  return (
    <FilterDropdown
      onValueChange={(val) => setSelectedBranch(val)}
      onSearchChange={(val) => setSearchText(val)}
      options={branchOptions}
      placeholder="Select Item Group..."
      searchPlaceholder="Search item groups..."
      icon={Trees}
      showAllOption
      allOptionLabel="All Item Groups"
      allOptionDescription="View all item groups"
      value={selectedBranch}
      allowClear
      shouldFilter={false}
    />
  );
};

export default ItemGroupFilter;
