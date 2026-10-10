import React, { useEffect, useId, useRef, useState } from "react";
import { Button } from "../Button/Button";
import { InputMessage } from "../Input/Input";
import type { InputSize } from "../Input/Input.type";
import {
	FileIcon,
	FileAudioIcon,
	FileJpgIcon,
	FilePdfIcon,
	FilePngIcon,
	FileVideoIcon,
	TrashIcon,
	UploadIcon,
	PauseIcon,
	PlayIcon,
} from "@phosphor-icons/react";

// Types
type MediaType = "image" | "pdf" | "audio" | "video" | "unknown";

interface LocalFile {
	type: "local";
	id: string;
	file: File;
	preview?: string;
}

type MediaItem = LocalFile;

interface FileInfo {
	name: string;
	size: string;
	type: string;
	pages?: number;
}

interface MediaPreviewProps {
	className?: string;
	label?: string;
	title?: string;
	required?: boolean;
	disabled?: boolean;
	multiple?: boolean;
	maxTotalSizeMb?: number;
	onChange?: (media: MediaItem[]) => void;
}

// Utilities
const ALLOWED_EXTENSIONS = {
	image: ["jpg", "jpeg", "png"],
	pdf: ["pdf"],
	audio: ["mp3"],
	video: ["mp4"],
};

const getFileExtension = (filename: string): string => {
	return filename.split(".").pop()?.toLowerCase() || "";
};

const detectMediaType = (filename: string): MediaType => {
	const ext = getFileExtension(filename);

	if (ALLOWED_EXTENSIONS.image.includes(ext)) return "image";
	if (ALLOWED_EXTENSIONS.pdf.includes(ext)) return "pdf";
	if (ALLOWED_EXTENSIONS.audio.includes(ext)) return "audio";
	if (ALLOWED_EXTENSIONS.video.includes(ext)) return "video";

	return "unknown";
};

const formatFileSize = (bytes: number): string => {
	if (bytes <= 0) return "0 KB";
	const kb = bytes / 1024;
	if (kb < 1024) return `${kb.toFixed(2)} KB`;
	return `${(kb / 1024).toFixed(2)} MB`;
};

const isValidExtension = (filename: string): boolean => {
	const ext = getFileExtension(filename);
	return Object.values(ALLOWED_EXTENSIONS).flat().includes(ext);
};

const getTypeIcon = (extension: string) => {
	switch (extension) {
		case "jpg":
		case "jpeg":
			return FileJpgIcon;
		case "png":
			return FilePngIcon;
		case "pdf":
			return FilePdfIcon;
		case "mp3":
			return FileAudioIcon;
		case "mp4":
			return FileVideoIcon;
		default:
			return FileIcon;
	}
};

// Components
const ACCEPTED_FILE_TYPES = ".jpg,.jpeg,.png,.pdf,.mp3,.mp4";
const EMPTY_VTT_DATA_URI = "data:text/vtt,WEBVTT";

const MediaPreview: React.FC<MediaPreviewProps> = ({
	className = "",
	label,
	title = "Preview",
	required,
	disabled = false,
	multiple = false,
	maxTotalSizeMb = 10,
	onChange,
}) => {
	const [media, setMedia] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [playingId, setPlayingId] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
	const mediaRef = useRef<MediaItem[]>([]);
	const inputId = useId();
	const resolvedLabel = label ?? title;
	const labelClasses = disabled
		? "text-[var(--ds-color-neutral-40)]"
		: "text-[var(--ds-color-neutral-10)]";
	const iconSizes: Record<InputSize, number> = { sm: 14, md: 20, lg: 24 };
	const totalBytes = media.reduce((acc, item) => acc + item.file.size, 0);
	const maxBytes = maxTotalSizeMb * 1024 * 1024;
	const totalFilesLabel = `${media.length} arquivo${media.length === 1 ? "" : "s"}`;
	const sizeSummary = `${formatFileSize(totalBytes)} / ${formatFileSize(maxBytes)} max`;
	let dropzoneClasses =
		"border-[var(--ds-color-neutral-80)] hover:border-[var(--ds-color-blue-40)] bg-[var(--ds-color-neutral-98)] cursor-pointer";
	if (disabled) {
		dropzoneClasses = "border-[var(--ds-color-neutral-80)] cursor-not-allowed opacity-60";
	} else if (error) {
		dropzoneClasses = "border-[var(--ds-color-red-30)] bg-[var(--ds-color-red-90)] cursor-pointer";
	} else if (isDragging) {
		dropzoneClasses = "border-[var(--ds-color-blue-40)] bg-[var(--ds-color-neutral-95)]";
	}

	useEffect(() => {
		mediaRef.current = media;
	}, [media]);

	useEffect(() => {
		return () => {
			mediaRef.current.forEach((item) => {
				if (item.preview) {
					URL.revokeObjectURL(item.preview);
				}
			});
		};
	}, []);

	useEffect(() => {
		if (playingId && !media.some((item) => item.id === playingId)) {
			setPlayingId(null);
		}
	}, [media, playingId]);

	const updateMedia = (nextMedia: MediaItem[]) => {
		setMedia((prev) => {
			const nextIds = new Set(nextMedia.map((item) => item.id));
			prev.forEach((item) => {
				if (item.preview && !nextIds.has(item.id)) {
					URL.revokeObjectURL(item.preview);
				}
			});
			return nextMedia;
		});
		onChange?.(nextMedia);
	};

	const createMediaItem = (file: File): LocalFile => {
		const mediaType = detectMediaType(file.name);
		const shouldCreatePreview =
			mediaType === "image" || mediaType === "audio" || mediaType === "video";
		const id = `${file.name}-${file.size}-${file.lastModified}`;
		return {
			type: "local",
			id,
			file,
			preview: shouldCreatePreview ? URL.createObjectURL(file) : undefined,
		};
	};

	const handleFiles = async (files: File[]) => {
		if (files.length === 0) return;
		setError(null);
		setLoading(true);

		const validFiles = files.filter((file) => isValidExtension(file.name));
		if (validFiles.length === 0) {
			setError("Formato de arquivo não suportado. Use: JPG, PNG, PDF, MP3 ou MP4");
			setLoading(false);
			return;
		}

		if (validFiles.length !== files.length) {
			setError("Alguns arquivos nao sao suportados e foram ignorados.");
		}

		try {
			const orderedFiles = [...validFiles].reverse();
			const incomingBytes = orderedFiles.reduce((acc, file) => acc + file.size, 0);
			const projectedBytes = multiple ? totalBytes + incomingBytes : incomingBytes;

			if (projectedBytes > maxBytes) {
				setError(
					`Tamanho máximo excedido. Atual: ${formatFileSize(
						projectedBytes,
					)} / Max: ${formatFileSize(maxBytes)}`,
				);
				return;
			}

			const filesToAdd = multiple ? orderedFiles : orderedFiles.slice(0, 1);
			const orderedItems = filesToAdd.map(createMediaItem);
			if (multiple) {
				updateMedia([...orderedItems, ...media]);
			} else {
				updateMedia(orderedItems);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;
		await handleFiles(files);
	};

	const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
		event.preventDefault();
		if (disabled) return;
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		if (disabled) return;
		setIsDragging(false);
	};

	const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
		event.preventDefault();
		if (disabled) return;
		setIsDragging(false);
		const files = Array.from(event.dataTransfer.files ?? []);
		if (files.length === 0) return;
		await handleFiles(files);
	};

	const handleOpenMedia = (item: MediaItem) => {
		const mediaType = detectMediaType(item.file.name);
		if (mediaType === "audio" || mediaType === "video") {
			return;
		}
		if (item.preview) {
			window.open(item.preview, "_blank", "noopener,noreferrer");
			return;
		}

		const tempUrl = URL.createObjectURL(item.file);
		window.open(tempUrl, "_blank", "noopener,noreferrer");
		setTimeout(() => URL.revokeObjectURL(tempUrl), 1000);
	};

	const toggleAudioPlay = async (id: string) => {
		if (disabled) return;
		const currentAudio = audioRefs.current[id];
		if (currentAudio) {
			if (playingId === id) {
				currentAudio.pause();
				setPlayingId(null);
				return;
			}
			try {
				if (playingId && audioRefs.current[playingId]) {
					audioRefs.current[playingId]?.pause();
				}
				await currentAudio.play();
				setPlayingId(id);
			} catch {
				setError("Não foi possível reproduzir o áudio");
			}
		}
	};

	const getFileInfo = (item: MediaItem): FileInfo => {
		const mediaType = detectMediaType(item.file.name);

		return {
			name: item.file.name,
			size: formatFileSize(item.file.size),
			type: item.file.type || mediaType.toUpperCase(),
			pages: undefined,
		};
	};

	const renderPreview = (item: MediaItem) => {
		const mediaType = detectMediaType(item.file.name);
		const fileInfo = getFileInfo(item);

		switch (mediaType) {
			case "image":
				return (
					<div className="w-full h-64 flex items-center justify-center bg-[var(--ds-color-neutral-98)] rounded-lg overflow-hidden">
						<img
							src={item.preview}
							alt={item.file.name}
							className="max-w-full max-h-full object-contain"
						/>
					</div>
				);

			case "pdf":
				return (
					<div className="w-full p-8 bg-[var(--ds-color-neutral-98)] rounded-lg border-[var(--ds-color-neutral-80)]">
						<div className="flex flex-col items-center gap-4">
							<div className="text-[var(--ds-color-blue-40)]">
								<FilePdfIcon size={48} />
							</div>
							<div className="text-center">
								<p className="font-semibold text-[var(--ds-color-neutral-10)]">{fileInfo?.name}</p>
								<p className="text-sm text-[var(--ds-color-neutral-50)] mt-1">{fileInfo?.size}</p>
							</div>
						</div>
					</div>
				);

			case "audio":
				return (
					<div className="w-full p-8 bg-gradient-to-br from-[var(--ds-color-blue-95)] to-[var(--ds-color-blue-90)] rounded-lg border border-[var(--ds-color-blue-80)]">
						<div className="flex flex-col items-center gap-4">
							<div className="text-[var(--ds-color-blue-40)]">
								<FileAudioIcon size={48} />
							</div>
							<div className="text-center">
								<p className="font-semibold text-[var(--ds-color-neutral-10)]">{fileInfo?.name}</p>
								<p className="text-sm text-[var(--ds-color-neutral-50)] mt-1">{fileInfo?.size}</p>
							</div>
							<Button
								onClick={() => toggleAudioPlay(item.id)}
								type="button"
								iconLeft={playingId === item.id ? PauseIcon : PlayIcon}
							>
								{playingId === item.id ? "Pausar" : "Reproduzir"}
							</Button>
							<audio
								ref={(element) => {
									audioRefs.current[item.id] = element;
								}}
								src={item.preview}
								onEnded={() => setPlayingId(null)}
							>
								<track kind="captions" src={EMPTY_VTT_DATA_URI} srcLang="pt-BR" label="Legendas" />
							</audio>
						</div>
					</div>
				);

			case "video":
				return (
					<div className="w-full bg-[var(--ds-color-neutral-10)] rounded-lg overflow-hidden">
						<video src={item.preview} controls className="w-full">
							<track kind="captions" src={EMPTY_VTT_DATA_URI} srcLang="pt-BR" label="Legendas" />
							Seu navegador não suporta o elemento de vídeo.
						</video>
					</div>
				);

			default:
				return (
					<div className="w-full p-8 bg-[var(--ds-color-neutral-98)] rounded-lg border-2 border-dashed border-[var(--ds-color-neutral-80)]">
						<div className="flex flex-col items-center gap-4">
							<div className="text-[var(--ds-color-neutral-40)]">
								<FileIcon size={48} />
							</div>
							<p className="text-[var(--ds-color-neutral-50)]">Tipo de arquivo não suportado</p>
						</div>
					</div>
				);
		}
	};

	return (
		<div className={`w-full max-w-none ${className}`}>
			<div
				id="media-preview"
				className={`w-full rounded-xl bg-[var(--ds-color-neutral-95)] p-4 ${error ? "border-2 border-dashed border-[var(--ds-color-red-30)]" : ""}`}
			>
				<div className="mb-2 flex items-center justify-between">
					{resolvedLabel && (
						<div className="flex flex-col gap-1">
							<label
								htmlFor={inputId}
								className={`flex items-center gap-1 font-body ${labelClasses} font-[var(--ds-label-1-weight)] ${disabled ? "cursor-default" : "cursor-pointer"}`}
							>
								{resolvedLabel}
								{required && (
									<span
										className={
											disabled ? "text-[var(--ds-color-red-90)]" : "text-[var(--ds-color-red-40)]"
										}
									>
										*
									</span>
								)}
							</label>
							<span
								className={`text-xs ${error ? "text-[var(--ds-color-red-30)]" : "text-[var(--ds-color-neutral-40)]"}`}
							>
								{totalFilesLabel} • {sizeSummary}
							</span>
						</div>
					)}
					{media.length > 0 && !loading && (
						<Button
							variant="secondary"
							disabled={disabled}
							size="sm"
							iconWeight="bold"
							onClick={(event) => {
								if (!disabled) {
									event.preventDefault();
									fileInputRef.current?.click();
								}
							}}
						>
							<small className="small font-medium">Adicionar arquivo</small>
						</Button>
					)}
				</div>
				<input
					id={inputId}
					ref={fileInputRef}
					type="file"
					className="hidden"
					accept={ACCEPTED_FILE_TYPES}
					onChange={handleFileSelect}
					disabled={disabled}
					multiple={multiple}
				/>

				{media.length === 0 && !loading && (
					<div className="space-y-4">
						<button
							type="button"
							className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${dropzoneClasses}`}
							onClick={() => {
								if (!disabled) {
									fileInputRef.current?.click();
								}
							}}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							disabled={disabled}
						>
							<p
								className={`mb-2 ${error ? "text-[var(--ds-color-red-30)]" : "text-[var(--ds-color-neutral-40)]"}`}
							>
								Clique para fazer upload
							</p>
							<p
								className={`text-sm ${error ? "text-[var(--ds-color-red-30)]" : "text-[var(--ds-color-neutral-40)]"}`}
							>
								JPG, PNG, PDF, MP3 ou MP4
							</p>
						</button>
					</div>
				)}

				{loading && (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--ds-color-blue-90)] border-t-[var(--ds-color-blue-40)] mb-4"></div>
						<p className="text-[var(--ds-color-neutral-40)]">Carregando...</p>
					</div>
				)}

				{media.length > 0 && !loading && (
					<div className="space-y-4">
						<div className="flex justify-between items-center"></div>

						<div className="grid gap-6 grid-cols-1">
							{media.map((item, index) => {
								const fileInfo = getFileInfo(item);
								const extension = getFileExtension(item.file.name);
								const TypeIcon = getTypeIcon(extension);

								return (
									<div
										key={item.id}
										className="h-full space-y-4 bg-[var(--ds-color-surface)] shadow-sm rounded-[8px] p-3"
									>
										<div className="flex items-center justify-between">
											<button
												type="button"
												className="flex min-w-0 items-center gap-3 text-left"
												onClick={() => handleOpenMedia(item)}
												disabled={disabled}
											>
												<span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ds-color-blue-95)] text-[var(--ds-color-blue-40)]">
													<TypeIcon size={20} />
												</span>
												<div className="min-w-0 flex-1">
													<h6 className="truncate text-sm font-semibold text-[var(--ds-color-neutral-30)]">
														{fileInfo.name}
													</h6>
													<small className="text-[var(--ds-color-neutral-50)]">
														{fileInfo.size}
													</small>
												</div>
											</button>
											<button
												onClick={(event) => {
													event.stopPropagation();
													updateMedia(media.filter((_, currentIndex) => currentIndex !== index));
												}}
												onKeyDownCapture={(event) => event.stopPropagation()}
												className="flex items-center gap-2 px-3 py-2 text-[var(--ds-color-red-50)] cursor-pointer rounded-lg hover:bg-[var(--ds-color-neutral-95)] transition-colors"
												type="button"
												disabled={disabled}
												aria-label="Remover arquivo"
											>
												<TrashIcon className="text-[var(--ds-color-red-50)]" size={20} />
											</button>
										</div>
										{renderPreview(item)}
									</div>
								);
							})}
							{multiple && (
								<button
									type="button"
									onClick={() => {
										if (!disabled) {
											fileInputRef.current?.click();
										}
									}}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									disabled={disabled}
									className={`flex min-h-[40px] flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed p-6 text-center transition-colors ${
										disabled
											? "border-[var(--ds-color-neutral-80)] cursor-not-allowed opacity-60"
											: "border-[var(--ds-color-neutral-80)] hover:border-[var(--ds-color-blue-40)] bg-[var(--ds-color-neutral-98)] cursor-pointer"
									}`}
								>
									<UploadIcon size={32} className="text-[var(--ds-color-neutral-40)]" />
									<span className="text-sm font-medium text-[var(--ds-color-neutral-40)]">
										Adicionar arquivo
									</span>
									<span className="text-xs text-[var(--ds-color-neutral-40)]">
										JPG, PNG, PDF, MP3 ou MP4
									</span>
								</button>
							)}
						</div>
					</div>
				)}
			</div>
			{error && (
				<div className="my-3">
					<InputMessage
						message={error}
						disabled={disabled}
						state="error"
						iconSizes={iconSizes}
						size="md"
					/>
				</div>
			)}
		</div>
	);
};

export default MediaPreview;
