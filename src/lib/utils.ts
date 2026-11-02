/**
 * Joins CSS class names while ignoring empty values.
 *
 * Useful when a component needs optional styling
 * without building long conditional class strings.
 */
export function cn(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}
