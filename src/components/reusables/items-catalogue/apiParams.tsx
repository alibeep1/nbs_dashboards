//DateFilter:3
//ItemCode:40
//ItemType:1
//SpecialGroup:100
//Manufacturer:1
//Brand:1
//Category:10
//Status:1
//EcommerceStatus:1
//ItemMovementControl:1
export interface IItemsCatalogueApiParams {
  // DateFilter?:number;
  ItemCode?: string;
  ItemType?: string;
  SpecialGroup?: string;
  Manufacturer?: string;
  Brand?: string;
  Category?: string;
  Status?: string;
  EcommerceStatus?: string;
  ItemMovementControl?: string;
}

/**
 * Builds query parameters from current items catalogue filter values
 * @param filters - Object containing items catalogue filter values
 * @returns URLSearchParams object with non-null/undefined values
 */
export const buildFiltersQueryParams = (
  filters: IItemsCatalogueApiParams
): URLSearchParams => {
  const params = new URLSearchParams();

  // Add each filter to params if it has a value
  if (
    filters.ItemCode !== undefined &&
    filters.ItemCode !== null &&
    filters.ItemCode.toString().length !== 0
  ) {
    params.append("ItemCode", filters.ItemCode.toString());
  }

  if (
    filters.ItemType !== undefined &&
    filters.ItemType !== null &&
    filters.ItemType.toString().length !== 0
  ) {
    params.append("ItemType", filters.ItemType.toString());
  }
  if (
    filters.SpecialGroup !== undefined &&
    filters.SpecialGroup !== null &&
    filters.SpecialGroup.toString().length !== 0
  ) {
    params.append("SpecialGroup", filters.SpecialGroup.toString());
  }
  if (
    filters.Manufacturer !== undefined &&
    filters.Manufacturer !== null &&
    filters.Manufacturer.toString().length !== 0
  ) {
    params.append("Manufacturer", filters.Manufacturer.toString());
  }
  if (
    filters.Brand !== undefined &&
    filters.Brand !== null &&
    filters.Brand.toString().length !== 0
  ) {
    params.append("Brand", filters.Brand.toString());
  }
  if (
    filters.Category !== undefined &&
    filters.Category !== null &&
    filters.Category.toString().length !== 0
  ) {
    params.append("Category", filters.Category.toString());
  }
  if (
    filters.Status !== undefined &&
    filters.Status !== null &&
    filters.Status.toString().length !== 0
  ) {
    params.append("Status", filters.Status.toString());
  }
  if (
    filters.EcommerceStatus !== undefined &&
    filters.EcommerceStatus !== null &&
    filters.EcommerceStatus.toString().length !== 0
  ) {
    params.append("EcommerceStatus", filters.EcommerceStatus.toString());
  }
  if (
    filters.ItemMovementControl !== undefined &&
    filters.ItemMovementControl !== null &&
    filters.ItemMovementControl.toString().length !== 0
  ) {
    params.append(
      "ItemMovementControl",
      filters.ItemMovementControl.toString()
    );
  }
  return params;
};
