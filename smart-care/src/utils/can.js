import permissions from "./permissions";

export function can(action) {
  const role = localStorage.getItem("role");

  if (!role) return false;

  return permissions[role]?.includes(action);
}