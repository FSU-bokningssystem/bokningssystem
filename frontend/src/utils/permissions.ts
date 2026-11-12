import type { MemberRole } from "../types/types";

export const canRemove = (actor: MemberRole, target: MemberRole) =>
  actor === "OWNER" || (actor === "ADMIN" && target === "MEMBER");
