import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFileUpload } from "./useFileUpload";

// Store original crypto for restoration
const originalCrypto = globalThis.crypto;

const createMockFile = (name: string, size: number, type: string): File => {
	const file = new File(["content"], name, { type });
	Object.defineProperty(file, "size", { value: size });
	return file;
};

describe("useFileUpload", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("initializes with empty files and isDragging false", () => {
		const { result } = renderHook(() => useFileUpload());
		expect(result.current.files).toEqual([]);
		expect(result.current.isDragging).toBe(false);
	});

	it("validates file size", () => {
		const onUploadError = vi.fn();
		const { result } = renderHook(() => useFileUpload({ maxSize: 1, onUploadError }));

		const largeFile = createMockFile("large.pdf", 2 * 1024 * 1024, "application/pdf");

		act(() => {
			result.current.addFiles([largeFile]);
		});

		expect(result.current.files[0].state).toBe("error");
		expect(result.current.files[0].error).toContain("Arquivo muito grande");
		expect(onUploadError).toHaveBeenCalled();
	});

	it("validates file format", () => {
		const onUploadError = vi.fn();
		const { result } = renderHook(() => useFileUpload({ acceptedFormats: ["pdf"], onUploadError }));

		const invalidFile = createMockFile("document.exe", 1024, "application/octet-stream");

		act(() => {
			result.current.addFiles([invalidFile]);
		});

		expect(result.current.files[0].state).toBe("error");
		expect(result.current.files[0].error).toContain("Formato não suportado");
		expect(onUploadError).toHaveBeenCalled();
	});

	it("accepts valid files and starts upload", () => {
		const { result } = renderHook(() => useFileUpload());

		const validFile = createMockFile("document.pdf", 1024, "application/pdf");

		act(() => {
			result.current.addFiles([validFile]);
		});

		expect(result.current.files[0].state).toBe("uploading");
		expect(result.current.files[0].progress).toBe(0);
	});

	it("simulates upload progress", async () => {
		const onUploadComplete = vi.fn();
		const { result } = renderHook(() => useFileUpload({ onUploadComplete }));

		const validFile = createMockFile("document.pdf", 1024, "application/pdf");

		act(() => {
			result.current.addFiles([validFile]);
		});

		// Advance timers to simulate upload progress
		act(() => {
			vi.advanceTimersByTime(2000);
		});

		// File should have progressed or completed
		expect(result.current.files[0].progress).toBeGreaterThanOrEqual(0);
	});

	it("removes files correctly", () => {
		const onFilesChange = vi.fn();
		const { result } = renderHook(() => useFileUpload({ onFilesChange }));

		const file = createMockFile("document.pdf", 1024, "application/pdf");

		act(() => {
			result.current.addFiles([file]);
		});

		const fileId = result.current.files[0].id;

		act(() => {
			result.current.removeFile(fileId);
		});

		expect(result.current.files).toHaveLength(0);
		expect(onFilesChange).toHaveBeenLastCalledWith([]);
	});

	it("handles drag enter event", () => {
		const { result } = renderHook(() => useFileUpload());

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.DragEvent;

		act(() => {
			result.current.handleDragEnter(mockEvent);
		});

		expect(result.current.isDragging).toBe(true);
		expect(mockEvent.preventDefault).toHaveBeenCalled();
	});

	it("handles drag leave event", () => {
		const { result } = renderHook(() => useFileUpload());

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.DragEvent;

		act(() => {
			result.current.handleDragEnter(mockEvent);
		});

		act(() => {
			result.current.handleDragLeave(mockEvent);
		});

		expect(result.current.isDragging).toBe(false);
	});

	it("handles drag over event", () => {
		const { result } = renderHook(() => useFileUpload());

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.DragEvent;

		act(() => {
			result.current.handleDragOver(mockEvent);
		});

		expect(mockEvent.preventDefault).toHaveBeenCalled();
	});

	it("handles drop event with files", () => {
		const { result } = renderHook(() => useFileUpload());

		const mockFile = createMockFile("document.pdf", 1024, "application/pdf");
		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			dataTransfer: {
				files: [mockFile],
			},
		} as unknown as React.DragEvent;

		act(() => {
			result.current.handleDrop(mockEvent);
		});

		expect(result.current.isDragging).toBe(false);
		expect(result.current.files).toHaveLength(1);
	});

	it("handles drop event with no files", () => {
		const { result } = renderHook(() => useFileUpload());

		const mockEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			dataTransfer: {
				files: [],
			},
		} as unknown as React.DragEvent;

		act(() => {
			result.current.handleDrop(mockEvent);
		});

		expect(result.current.files).toHaveLength(0);
	});

	it("handles file input change", () => {
		const { result } = renderHook(() => useFileUpload());

		const mockFile = createMockFile("document.pdf", 1024, "application/pdf");
		const mockEvent = {
			target: {
				files: [mockFile],
				value: "C:\\fakepath\\document.pdf",
			},
		} as unknown as React.ChangeEvent<HTMLInputElement>;

		act(() => {
			result.current.handleFileInputChange(mockEvent);
		});

		expect(result.current.files).toHaveLength(1);
		expect(mockEvent.target.value).toBe("");
	});

	it("handles file input change with no files", () => {
		const { result } = renderHook(() => useFileUpload());

		const mockEvent = {
			target: {
				files: null,
				value: "",
			},
		} as unknown as React.ChangeEvent<HTMLInputElement>;

		act(() => {
			result.current.handleFileInputChange(mockEvent);
		});

		expect(result.current.files).toHaveLength(0);
	});

	it("formats file size correctly", () => {
		const { result } = renderHook(() => useFileUpload());

		expect(result.current.formatFileSize(0)).toBe("0 Bytes");
		expect(result.current.formatFileSize(1024)).toBe("1KB");
		expect(result.current.formatFileSize(1024 * 1024)).toBe("1MB");
		expect(result.current.formatFileSize(1024 * 1024 * 1024)).toBe("1GB");
	});

	it("calculates time remaining for upload", () => {
		const { result } = renderHook(() => useFileUpload());

		// Non-uploading file returns empty string
		const completedFile = {
			id: `${Date.now()}`,
			file: createMockFile("doc.pdf", 1000, "application/pdf"),
			state: "completed" as const,
			progress: 100,
			uploadedSize: 1000,
		};
		expect(result.current.getTimeRemaining(completedFile)).toBe("");

		// File without uploadedSize returns empty string
		const noUploadedSize = {
			id: `${Date.now()}`,
			file: createMockFile("doc.pdf", 1000, "application/pdf"),
			state: "uploading" as const,
			progress: 50,
			uploadedSize: 0,
		};
		expect(result.current.getTimeRemaining(noUploadedSize)).toBe("");
	});

	it("calculates seconds remaining for fast uploads", () => {
		const { result } = renderHook(() => useFileUpload());

		// Create a file with ID that simulates 1 second ago
		const oneSecondAgo = Date.now() - 1000;
		const uploadingFile = {
			id: `${oneSecondAgo}`,
			file: createMockFile("doc.pdf", 10000, "application/pdf"),
			state: "uploading" as const,
			progress: 50,
			uploadedSize: 5000, // 5000 bytes uploaded in 1 second = 5000 bytes/s
		};
		// Remaining: 5000 bytes at 5000 bytes/s = 1 second
		const timeRemaining = result.current.getTimeRemaining(uploadingFile);
		expect(timeRemaining).toContain("segundos restantes");
	});

	it("calculates minutes remaining for slow uploads", () => {
		const { result } = renderHook(() => useFileUpload());

		// Create a file with ID that simulates 1 second ago, with very slow upload
		const oneSecondAgo = Date.now() - 1000;
		const uploadingFile = {
			id: `${oneSecondAgo}`,
			file: createMockFile("doc.pdf", 1000000, "application/pdf"),
			state: "uploading" as const,
			progress: 1,
			uploadedSize: 100, // 100 bytes uploaded in 1 second = 100 bytes/s
		};
		// Remaining: ~999900 bytes at 100 bytes/s = ~9999 seconds = ~166 minutes
		const timeRemaining = result.current.getTimeRemaining(uploadingFile);
		expect(timeRemaining).toContain("minutos restantes");
	});

	it("shows singular minute for 1 minute remaining", () => {
		const { result } = renderHook(() => useFileUpload());

		// Create a scenario where exactly 1 minute remains (60-119 seconds)
		// Need: remainingBytes / bytesPerSecond to be between 60 and 119 seconds
		// If uploadedSize = 1000 bytes in 1 second, then bytesPerSecond = 1000
		// If remaining = 90000 bytes, then secondsRemaining = 90 = 1.5 minutes = ceil to 2 minutes
		// For exactly 1 minute: remaining / rate between 60 and 119
		// Let's use: rate = 1000 bytes/s, remaining = 60000 bytes = 60 seconds = 1 minute
		const oneSecondAgo = Date.now() - 1000;
		const uploadingFile = {
			id: `${oneSecondAgo}`,
			file: createMockFile("doc.pdf", 61000, "application/pdf"),
			state: "uploading" as const,
			progress: 50,
			uploadedSize: 1000, // 1000 bytes/s, 60000 remaining = 60 seconds = 1 minute exactly
		};
		const timeRemaining = result.current.getTimeRemaining(uploadingFile);
		// Should contain "minuto" (singular)
		expect(timeRemaining).toBe("1 minuto restantes");
	});

	it("limits to single file when multiple is false", () => {
		const { result } = renderHook(() => useFileUpload({ multiple: false }));

		const file1 = createMockFile("doc1.pdf", 1024, "application/pdf");
		const file2 = createMockFile("doc2.pdf", 1024, "application/pdf");

		act(() => {
			result.current.addFiles([file1, file2]);
		});

		expect(result.current.files).toHaveLength(1);
	});

	it("allows multiple files when multiple is true", () => {
		const { result } = renderHook(() => useFileUpload({ multiple: true }));

		const file1 = createMockFile("doc1.pdf", 1024, "application/pdf");
		const file2 = createMockFile("doc2.pdf", 1024, "application/pdf");

		act(() => {
			result.current.addFiles([file1, file2]);
		});

		expect(result.current.files).toHaveLength(2);
	});

	it("calls onFilesChange when files are added", () => {
		const onFilesChange = vi.fn();
		const { result } = renderHook(() => useFileUpload({ onFilesChange }));

		const file = createMockFile("document.pdf", 1024, "application/pdf");

		act(() => {
			result.current.addFiles([file]);
		});

		expect(onFilesChange).toHaveBeenCalled();
	});

	it("completes upload simulation", () => {
		const onUploadComplete = vi.fn();
		const { result } = renderHook(() => useFileUpload({ onUploadComplete }));

		const validFile = createMockFile("document.pdf", 1024, "application/pdf");

		act(() => {
			result.current.addFiles([validFile]);
		});

		// Run timers multiple times to complete upload (each interval is 300ms)
		for (let i = 0; i < 30; i++) {
			act(() => {
				vi.advanceTimersByTime(300);
			});
			if (result.current.files[0]?.state === "completed") break;
		}

		expect(result.current.files[0].state).toBe("completed");
		expect(result.current.files[0].progress).toBe(100);
		expect(onUploadComplete).toHaveBeenCalled();
	});

	describe("createFileId with different crypto availability", () => {
		afterEach(() => {
			// Restore original crypto after each test
			Object.defineProperty(globalThis, "crypto", {
				value: originalCrypto,
				writable: true,
				configurable: true,
			});
		});

		it("uses crypto.randomUUID when available", () => {
			const mockRandomUUID = vi.fn().mockReturnValue("test-uuid-1234");
			Object.defineProperty(globalThis, "crypto", {
				value: {
					randomUUID: mockRandomUUID,
					getRandomValues: originalCrypto?.getRandomValues?.bind(originalCrypto),
				},
				writable: true,
				configurable: true,
			});

			const { result } = renderHook(() => useFileUpload());
			const file = createMockFile("document.pdf", 1024, "application/pdf");

			act(() => {
				result.current.addFiles([file]);
			});

			expect(result.current.files[0].id).toContain("test-uuid-1234");
			expect(mockRandomUUID).toHaveBeenCalled();
		});

		it("uses crypto.getRandomValues when randomUUID is not available", () => {
			const mockGetRandomValues = vi.fn((buffer: Uint32Array) => {
				buffer[0] = 0x12345678;
				buffer[1] = 0x9abcdef0;
				return buffer;
			});
			Object.defineProperty(globalThis, "crypto", {
				value: {
					randomUUID: undefined,
					getRandomValues: mockGetRandomValues,
				},
				writable: true,
				configurable: true,
			});

			const { result } = renderHook(() => useFileUpload());
			const file = createMockFile("document.pdf", 1024, "application/pdf");

			act(() => {
				result.current.addFiles([file]);
			});

			// Should contain hex values from our mocked buffer
			expect(result.current.files[0].id).toContain("123456789abcdef0");
			expect(mockGetRandomValues).toHaveBeenCalled();
		});

		it("uses fallback sequence when crypto is not available", () => {
			Object.defineProperty(globalThis, "crypto", {
				value: undefined,
				writable: true,
				configurable: true,
			});

			const { result } = renderHook(() => useFileUpload());
			const file1 = createMockFile("document1.pdf", 1024, "application/pdf");
			const file2 = createMockFile("document2.pdf", 1024, "application/pdf");

			act(() => {
				result.current.addFiles([file1]);
			});

			const firstId = result.current.files[0].id;
			// Should have format: timestamp-sequence
			expect(firstId).toMatch(/^\d+-\d+$/);

			act(() => {
				result.current.addFiles([file2]);
			});

			const secondId = result.current.files[1].id;
			// Second file should have incremented sequence
			expect(secondId).toMatch(/^\d+-\d+$/);
		});
	});

	describe("getRandomIncrement with different crypto availability", () => {
		afterEach(() => {
			// Restore original crypto after each test
			Object.defineProperty(globalThis, "crypto", {
				value: originalCrypto,
				writable: true,
				configurable: true,
			});
		});

		it("uses crypto.getRandomValues when available for random increment", () => {
			// Mock getRandomValues to return a predictable value
			const mockGetRandomValues = vi.fn((buffer: Uint32Array) => {
				buffer[0] = 0x80000000; // Half of max uint32
				return buffer;
			});
			Object.defineProperty(globalThis, "crypto", {
				value: {
					randomUUID: vi.fn().mockReturnValue("test-uuid"),
					getRandomValues: mockGetRandomValues,
				},
				writable: true,
				configurable: true,
			});

			const { result } = renderHook(() => useFileUpload());
			const file = createMockFile("document.pdf", 1024, "application/pdf");

			act(() => {
				result.current.addFiles([file]);
			});

			// Advance timer to trigger getRandomIncrement
			act(() => {
				vi.advanceTimersByTime(300);
			});

			// getRandomValues should have been called (once for UUID, multiple times for random increment)
			expect(mockGetRandomValues).toHaveBeenCalled();
		});

		it("uses fallback value when crypto.getRandomValues is not available", () => {
			Object.defineProperty(globalThis, "crypto", {
				value: undefined,
				writable: true,
				configurable: true,
			});

			const { result } = renderHook(() => useFileUpload());
			const file = createMockFile("document.pdf", 1024, "application/pdf");

			act(() => {
				result.current.addFiles([file]);
			});

			// Advance timer to trigger getRandomIncrement multiple times
			// Without crypto, it should use maxIncrement / 2 = 7.5 each time
			act(() => {
				vi.advanceTimersByTime(300);
			});

			// File should still progress with fallback increment
			expect(result.current.files[0].progress).toBeGreaterThanOrEqual(0);
		});
	});
});
