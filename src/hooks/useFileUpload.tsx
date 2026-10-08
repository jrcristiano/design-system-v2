import { useCallback, useState } from "react";
import type { FileUploadItem, UploadState } from "../components/Input/InputUpload.type";

let fallbackIdSequence = 0;

const createFileId = () => {
	const timestamp = Date.now();

	if (globalThis.crypto?.randomUUID) {
		return `${timestamp}-${globalThis.crypto.randomUUID()}`;
	}

	if (globalThis.crypto?.getRandomValues) {
		const buffer = new Uint32Array(2);
		globalThis.crypto.getRandomValues(buffer);
		const suffix = Array.from(buffer, (value) => value.toString(16).padStart(8, "0")).join("");
		return `${timestamp}-${suffix}`;
	}

	fallbackIdSequence += 1;
	return `${timestamp}-${fallbackIdSequence}`;
};

const getRandomIncrement = (maxIncrement: number) => {
	if (globalThis.crypto?.getRandomValues) {
		const buffer = new Uint32Array(1);
		globalThis.crypto.getRandomValues(buffer);
		return (buffer[0] / 0xffffffff) * maxIncrement;
	}

	return maxIncrement / 2;
};

interface UseFileUploadOptions {
	maxSize?: number;
	acceptedFormats?: string[];
	multiple?: boolean;
	onFilesChange?: (files: FileUploadItem[]) => void;
	onUploadComplete?: (file: FileUploadItem) => void;
	onUploadError?: (file: FileUploadItem, error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
	const {
		maxSize = 5,
		acceptedFormats = ["pdf", "doc", "docx"],
		multiple = true,
		onFilesChange,
		onUploadComplete,
		onUploadError,
	} = options;

	const [files, setFiles] = useState<FileUploadItem[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	const updateFileProgress = useCallback(
		(fileId: string, progress: number, uploadedSize: number) => {
			setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress, uploadedSize } : f)));
		},
		[],
	);

	const markFileCompleted = useCallback((fileId: string) => {
		setFiles((prev) =>
			prev.map((f) =>
				f.id === fileId ? { ...f, state: "completed" as UploadState, progress: 100 } : f,
			),
		);
	}, []);

	const validateFile = useCallback(
		(file: File): { valid: boolean; error?: string } => {
			const fileSizeMB = file.size / (1024 * 1024);
			if (fileSizeMB > maxSize) {
				return { valid: false, error: `Arquivo muito grande. Máximo: ${maxSize}MB` };
			}

			const fileExtension = file.name.split(".").pop()?.toLowerCase();
			if (fileExtension && !acceptedFormats.includes(fileExtension)) {
				return {
					valid: false,
					error: `Formato não suportado. Use: ${acceptedFormats.join(", ").toUpperCase()}`,
				};
			}

			return { valid: true };
		},
		[maxSize, acceptedFormats],
	);

	const simulateUpload = useCallback(
		(fileItem: FileUploadItem) => {
			let progress = 0;
			const interval = setInterval(() => {
				progress += getRandomIncrement(15);
				if (progress >= 100) {
					progress = 100;
					clearInterval(interval);
					markFileCompleted(fileItem.id);
					onUploadComplete?.({ ...fileItem, state: "completed", progress: 100 });
				} else {
					const roundedProgress = Math.round(progress);
					const uploadedSize = Math.round((fileItem.file.size * progress) / 100);
					updateFileProgress(fileItem.id, roundedProgress, uploadedSize);
				}
			}, 300);
		},
		[onUploadComplete, markFileCompleted, updateFileProgress],
	);

	const addFiles = useCallback(
		(newFiles: File[]) => {
			const filesToAdd = multiple ? newFiles : newFiles.slice(0, 1);

			const fileItems: FileUploadItem[] = filesToAdd.map((file) => {
				const validation = validateFile(file);
				return {
					id: createFileId(),
					file,
					state: validation.valid ? ("uploading" as UploadState) : ("error" as UploadState),
					progress: 0,
					error: validation.error,
					uploadedSize: 0,
				};
			});

			setFiles((prev) => {
				const updated = multiple ? [...prev, ...fileItems] : fileItems;
				onFilesChange?.(updated);
				return updated;
			});

			fileItems.forEach((fileItem) => {
				if (fileItem.state === "uploading") {
					simulateUpload(fileItem);
				} else if (fileItem.error) {
					onUploadError?.(fileItem, fileItem.error);
				}
			});
		},
		[multiple, validateFile, onFilesChange, onUploadError, simulateUpload],
	);

	const removeFile = useCallback(
		(fileId: string) => {
			setFiles((prev) => {
				const updated = prev.filter((f) => f.id !== fileId);
				onFilesChange?.(updated);
				return updated;
			});
		},
		[onFilesChange],
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const droppedFiles = Array.from(e.dataTransfer.files);
			if (droppedFiles.length > 0) {
				addFiles(droppedFiles);
			}
		},
		[addFiles],
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
			if (selectedFiles.length > 0) {
				addFiles(selectedFiles);
			}

			e.target.value = "";
		},
		[addFiles],
	);

	const formatFileSize = useCallback((bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
	}, []);

	const getTimeRemaining = useCallback((file: FileUploadItem): string => {
		if (file.state !== "uploading" || !file.uploadedSize) return "";

		const bytesPerSecond = file.uploadedSize / ((Date.now() - Number.parseInt(file.id, 10)) / 1000);
		const remainingBytes = file.file.size - file.uploadedSize;
		const secondsRemaining = remainingBytes / bytesPerSecond;

		if (secondsRemaining < 60) {
			return `${Math.ceil(secondsRemaining)} segundos restantes`;
		}
		const minutesRemaining = Math.ceil(secondsRemaining / 60);
		return `${minutesRemaining} ${minutesRemaining === 1 ? "minuto" : "minutos"} restantes`;
	}, []);

	return {
		files,
		isDragging,
		addFiles,
		removeFile,
		handleDragEnter,
		handleDragLeave,
		handleDragOver,
		handleDrop,
		handleFileInputChange,
		formatFileSize,
		getTimeRemaining,
	};
}
