export function percentChangeFormat(value: string): string {
  if (value?.charAt(0) === "0") {
    return `neutral`;
  } else if (value?.charAt(0) === "-") {
    return `negative`;
  } else {
    return "positive";
  }
}
