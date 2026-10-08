import type { ReactNode } from "react";
import type { FileUploadItem } from "./InputUpload.type";

export interface InputUploadProps {
	message?: string;
	disabled?: boolean;
	multiple?: boolean;
	maxSize?: number;
	acceptedFormats?: string[];
	onFilesChange?: (files: FileUploadItem[]) => void;
	onUploadComplete?: (file: FileUploadItem) => void;
	onUploadError?: (file: FileUploadItem, error: string) => void;
	onRemoveFile?: (fileId: string) => void;
	files?: FileUploadItem[];
	tooltipContent?: ReactNode;
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
}
