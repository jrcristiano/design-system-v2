import React, {
	useRef,
	cloneElement,
	isValidElement,
	memo,
	useMemo,
	useCallback,
	type ReactNode,
} from "react";
import { CloudArrowUpIcon, FileCloudIcon, TrashIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import "./../../tokens/typography.css";
import "./../../tokens/colors.css";
import type { InputUploadProps } from "./InputUpload.interface";
import { useFileUpload } from "../../hooks/useFileUpload";
import { Tooltip } from "../Tooltip/Tooltip";
import { IconSlot } from "../shared/IconSlot";

interface FileItemProps {
	fileItem: any;
	disabled: boolean;
	tooltipContent?: ReactNode;
	iconRight: ReactNode;
	onIconRightClick?: () => void;
	onRemove: (id: string) => void;
	formatFileSize: (size: number) => string;
	getTimeRemaining: (file: any) => string;
}

const FileItem = memo<FileItemProps>(
	({
		fileItem,
		disabled,
		tooltipContent,
		iconRight,
		onIconRightClick,
		onRemove,
		formatFileSize,
		getTimeRemaining,
	}) => {
		const isUploading = fileItem.state === "uploading";
		const isCompleted = fileItem.state === "completed";
		const isError = fileItem.state === "error";

		const truncatedName = useMemo(() => {
			if (fileItem.file.name.length > 35) {
				const ext = fileItem.file.name.split(".").pop();
				return `${fileItem.file.name.substring(0, 32)}...${ext}`;
			}
			return fileItem.file.name;
		}, [fileItem.file.name]);

		const nameClasses = useMemo(
			() =>
				clsx("text-base", {
					"text-[var(--ds-color-neutral-60)]": !isError,
					"text-[var(--ds-color-neutral-40)] underline": isCompleted,
					"text-[var(--ds-color-sky-90)] underline": isError,
				}),
			[isError, isCompleted],
		);

		const buttonClasses = useMemo(
			() =>
				clsx("w-6 h-6 flex items-center justify-center", {
					"hover:opacity-70": !disabled,
					"opacity-50 cursor-not-allowed": disabled,
				}),
			[disabled],
		);

		const clonedIconRight = useMemo(
			() =>
				isValidElement(iconRight)
					? cloneElement(iconRight as React.ReactElement<any>, {
							size: 24,
							weight: "regular",
							className: "text-[var(--ds-color-sky-30)]",
						})
					: iconRight,
			[iconRight],
		);

		const handleRemoveClick = useCallback(() => {
			if (disabled) return;
			onIconRightClick?.();
			onRemove(fileItem.id);
		}, [disabled, onIconRightClick, fileItem.id, onRemove]);

		return (
			<Tooltip content={tooltipContent} placement="top-end" disabled={!tooltipContent || disabled}>
				<div className="flex items-center gap-4 w-full relative">
					<div className="w-10 h-10 flex items-center justify-center">
						<FileCloudIcon size={40} weight="regular" className="text-[var(--ds-color-blue-40)]" />
					</div>

					<div className="flex-1 flex flex-col gap-2">
						<div className="flex flex-col">
							<p
								className={nameClasses}
								style={{
									fontFamily: "var(--ds-font-family-body)",
									fontWeight: "var(--ds-font-weight-regular)",
								}}
							>
								{truncatedName}
							</p>
							<p
								className="text-xs text-[var(--ds-color-neutral-10)]"
								style={{
									fontFamily: "var(--ds-font-family-body)",
									fontWeight: "var(--ds-font-weight-regular)",
								}}
							>
								{isUploading && getTimeRemaining(fileItem)}
								{isCompleted && formatFileSize(fileItem.file.size)}
								{isError && <span className="text-[var(--ds-color-red-40)]">{fileItem.error}</span>}
							</p>
						</div>

						{isUploading && (
							<div className="w-full h-2 bg-[var(--ds-color-neutral-white)] bg-opacity-20 rounded-full overflow-hidden">
								<div
									className="h-full bg-[var(--ds-color-neutral-40)] rounded-full transition-all duration-300"
									style={{ width: `${fileItem.progress}%` }}
								/>
							</div>
						)}
					</div>

					<button
						type="button"
						onClick={handleRemoveClick}
						disabled={disabled}
						className={buttonClasses}
					>
						{isUploading ? (
							<XIcon size={24} weight="regular" className="text-[var(--ds-color-sky-30)]" />
						) : (
							clonedIconRight
						)}
					</button>
				</div>
			</Tooltip>
		);
	},
);

FileItem.displayName = "FileItem";

type DropzoneEmptyProps = {
	dropzoneClasses: string;
	disabled: boolean;
	onDropzoneClick: () => void;
	onDropzoneKeyDown: (e: React.KeyboardEvent) => void;
	onDragEnter: (e: React.DragEvent) => void;
	onDragLeave: (e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onIconLeftClick?: () => void;
	iconNode: ReactNode;
	acceptedFormatsText: string;
	maxSize: number;
};

const DropzoneEmpty = memo<DropzoneEmptyProps>(
	({
		dropzoneClasses,
		disabled,
		onDropzoneClick,
		onDropzoneKeyDown,
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDrop,
		onIconLeftClick,
		iconNode,
		acceptedFormatsText,
		maxSize,
	}) => (
		<button
			type="button"
			className={dropzoneClasses}
			onClick={onDropzoneClick}
			onKeyDown={onDropzoneKeyDown}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
			disabled={disabled}
			aria-label="Selecionar arquivos para upload"
		>
			<div className="flex items-center gap-4">
				<IconSlot className="flex items-center justify-center" onClick={onIconLeftClick} as="span">
					{iconNode}
				</IconSlot>
				<div className="flex flex-col gap-4 text-left">
					<p
						className="text-base"
						style={{
							fontFamily: "var(--ds-font-family-body)",
							fontWeight: "var(--ds-font-weight-regular)",
							lineHeight: "var(--ds-line-15)",
						}}
					>
						<span
							style={{ fontWeight: "var(--ds-font-weight-semibold)" }}
							className={clsx("underline", {
								"text-[var(--ds-color-sky-30)]": !disabled,
								"text-[var(--ds-color-neutral-40)]": disabled,
							})}
						>
							Selecione um ou mais arquivos
						</span>
						<span
							className={
								disabled ? "text-[var(--ds-color-neutral-40)]" : "text-[var(--ds-color-sky-30)]"
							}
						>
							{" "}
						</span>
						<span
							style={{ fontWeight: "var(--ds-font-weight-regular)" }}
							className={
								disabled ? "text-[var(--ds-color-neutral-40)]" : "text-[var(--ds-color-neutral-10)]"
							}
						>
							ou arraste-os para cá.
						</span>
					</p>
					<p
						className="text-sm text-[var(--ds-color-neutral-40)]"
						style={{
							fontFamily: "var(--ds-font-family-body)",
							fontWeight: "var(--ds-font-weight-regular)",
						}}
					>
						Arquivos {acceptedFormatsText} com no máximo {maxSize}MB.
					</p>
				</div>
			</div>
		</button>
	),
);

DropzoneEmpty.displayName = "DropzoneEmpty";

type DropzoneWithFilesProps = {
	dropzoneClasses: string;
	disabled: boolean;
	displayFiles: any[];
	tooltipContent?: ReactNode;
	iconRight: ReactNode;
	onIconRightClick?: () => void;
	onRemove: (id: string) => void;
	formatFileSize: (size: number) => string;
	getTimeRemaining: (file: any) => string;
	onBrowseClick: () => void;
	onDragEnter: (e: React.DragEvent) => void;
	onDragLeave: (e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
};

const DropzoneWithFiles = memo<DropzoneWithFilesProps>(
	({
		dropzoneClasses,
		disabled,
		displayFiles,
		tooltipContent,
		iconRight,
		onIconRightClick,
		onRemove,
		formatFileSize,
		getTimeRemaining,
		onBrowseClick,
		onDragEnter,
		onDragLeave,
		onDragOver,
		onDrop,
	}) => (
		<div className={dropzoneClasses}>
			{displayFiles.map((fileItem) => (
				<FileItem
					key={fileItem.id}
					fileItem={fileItem}
					disabled={disabled}
					tooltipContent={tooltipContent}
					iconRight={iconRight}
					onIconRightClick={onIconRightClick}
					onRemove={onRemove}
					formatFileSize={formatFileSize}
					getTimeRemaining={getTimeRemaining}
				/>
			))}
			<button
				type="button"
				className="w-full py-2 text-sm text-[var(--ds-color-sky-30)] hover:text-[var(--ds-color-sky-40)] underline disabled:text-[var(--ds-color-neutral-40)] disabled:cursor-not-allowed"
				onClick={onBrowseClick}
				onDragEnter={onDragEnter}
				onDragLeave={onDragLeave}
				onDragOver={onDragOver}
				onDrop={onDrop}
				disabled={disabled}
				style={{
					fontFamily: "var(--ds-font-family-body)",
					fontWeight: "var(--ds-font-weight-semibold)",
				}}
			>
				Adicionar mais arquivos
			</button>
		</div>
	),
);

DropzoneWithFiles.displayName = "DropzoneWithFiles";

export const InputUpload: React.FC<InputUploadProps> = memo(
	({
		message,
		disabled = false,
		multiple = true,
		maxSize = 5,
		acceptedFormats = ["pdf", "doc", "docx"],
		onFilesChange,
		onUploadComplete,
		onUploadError,
		onRemoveFile,
		files: controlledFiles,
		tooltipContent,
		iconLeft = <CloudArrowUpIcon />,
		iconRight = <TrashIcon />,
		onIconLeftClick,
		onIconRightClick,
	}) => {
		const fileInputRef = useRef<HTMLInputElement>(null);

		const {
			files,
			isDragging,
			removeFile,
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			handleFileInputChange,
			formatFileSize,
			getTimeRemaining,
		} = useFileUpload({
			maxSize,
			acceptedFormats,
			multiple,
			onFilesChange,
			onUploadComplete,
			onUploadError,
		});

		const displayFiles = controlledFiles || files;

		const handleBrowseClick = useCallback(() => {
			if (!disabled) {
				fileInputRef.current?.click();
			}
		}, [disabled]);

		const handleRemove = useCallback(
			(fileId: string) => {
				removeFile(fileId);
				onRemoveFile?.(fileId);
			},
			[removeFile, onRemoveFile],
		);

		const handleDropzoneClick = useCallback(() => {
			if (displayFiles.length === 0) {
				handleBrowseClick();
			}
		}, [displayFiles.length, handleBrowseClick]);

		const handleIconLeftClick = useCallback(() => {
			if (disabled) return;
			onIconLeftClick?.();
		}, [disabled, onIconLeftClick]);

		const handleDropzoneKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if ((e.key === "Enter" || e.key === " ") && displayFiles.length === 0) {
					e.preventDefault();
					handleBrowseClick();
				}
			},
			[displayFiles.length, handleBrowseClick],
		);

		const dropzoneClasses = useMemo(
			() =>
				clsx(
					"px-6 py-5 rounded-[24px] transition-all duration-150 min-h-[100px]",
					"flex flex-col items-start justify-center gap-4",
					{
						"border-[3px] border-dashed border-[var(--ds-color-neutral-50)] hover:border-[var(--ds-color-neutral-40)] cursor-pointer":
							displayFiles.length === 0 && !disabled && !isDragging,
						"border-[1px] border-solid border-[var(--ds-color-neutral-50)] hover:border-[var(--ds-color-neutral-40)]":
							displayFiles.length > 0 && !disabled && !isDragging,
						"border-[2px] border-dashed border-[var(--ds-color-blue-40)] bg-[var(--ds-color-blue-98)] cursor-pointer":
							isDragging && !disabled,
						"border-[1px] border-solid border-[var(--ds-color-neutral-80)] bg-[var(--ds-color-neutral-90)] cursor-not-allowed":
							disabled,
					},
				),
			[displayFiles.length, disabled, isDragging],
		);

		const clonedIconLeft = useMemo(
			() =>
				isValidElement(iconLeft)
					? cloneElement(iconLeft as React.ReactElement<any>, {
							size: 40,
							weight: "regular",
							className: disabled
								? "text-[var(--ds-color-neutral-40)]"
								: "text-[var(--ds-color-blue-40)]",
						})
					: iconLeft,
			[iconLeft, disabled],
		);

		const acceptedFormatsText = useMemo(
			() => acceptedFormats.map((f) => f.toUpperCase()).join(" ou "),
			[acceptedFormats],
		);

		const acceptAttribute = useMemo(
			() => acceptedFormats.map((f) => `.${f}`).join(","),
			[acceptedFormats],
		);

		const dropzoneElement =
			displayFiles.length === 0 ? (
				<DropzoneEmpty
					dropzoneClasses={dropzoneClasses}
					disabled={disabled}
					onDropzoneClick={handleDropzoneClick}
					onDropzoneKeyDown={handleDropzoneKeyDown}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onIconLeftClick={onIconLeftClick ? handleIconLeftClick : undefined}
					iconNode={clonedIconLeft}
					acceptedFormatsText={acceptedFormatsText}
					maxSize={maxSize}
				/>
			) : (
				<DropzoneWithFiles
					dropzoneClasses={dropzoneClasses}
					disabled={disabled}
					displayFiles={displayFiles}
					tooltipContent={tooltipContent}
					iconRight={iconRight}
					onIconRightClick={onIconRightClick}
					onRemove={handleRemove}
					formatFileSize={formatFileSize}
					getTimeRemaining={getTimeRemaining}
					onBrowseClick={handleBrowseClick}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				/>
			);

		return (
			<div className="flex flex-col gap-2">
				{dropzoneElement}

				{message && (
					<p
						className="text-sm text-[var(--ds-color-neutral-40)]"
						style={{
							fontFamily: "var(--ds-font-family-body)",
							fontWeight: "var(--ds-font-weight-regular)",
						}}
					>
						{message}
					</p>
				)}

				<input
					ref={fileInputRef}
					type="file"
					multiple={multiple}
					accept={acceptAttribute}
					onChange={handleFileInputChange}
					disabled={disabled}
					className="hidden"
				/>
			</div>
		);
	},
);

InputUpload.displayName = "InputUpload";
