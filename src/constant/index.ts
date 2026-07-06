export const USER_ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export const ALL_ROLES = Object.values(USER_ROLES);

// Route-level permission groups, per docs/requirement.md's permissions table
export const ROLES_MANAGE_PRODUCTS = [USER_ROLES.ADMIN, USER_ROLES.MANAGER];
export const ROLES_VIEW_PRODUCTS = ALL_ROLES;
export const ROLES_CREATE_SALES = ALL_ROLES;
export const ROLES_VIEW_SALES = [USER_ROLES.ADMIN, USER_ROLES.MANAGER];
export const ROLES_VIEW_DASHBOARD = [USER_ROLES.ADMIN, USER_ROLES.MANAGER];
export const ROLES_MANAGE_USERS = [USER_ROLES.ADMIN];
