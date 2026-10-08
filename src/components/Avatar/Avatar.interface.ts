import type { HTMLAttributes } from "react";
import type { IconSize } from "../../types/Commons.type";

export type AvatarStatus = "available" | "away";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
	avatarUserName?: string;
	status?: AvatarStatus;
	bordered?: boolean;
	iconSize?: IconSize;
}
