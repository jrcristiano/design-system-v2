export type UploadState = "idle" | "uploading" | "completed" | "error";

export interface FileUploadItem {
	id: string;
	file: File;
	state: UploadState;
	progress: number;
	error?: string;
	uploadedSize?: number;
}
