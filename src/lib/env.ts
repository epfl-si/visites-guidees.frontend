export function env() {
  return window._12factor ?? import.meta.env;
}
