import { useCallback, useRef } from "react";
import { Mask } from "maska";

export function useMask() {
	const maskCacheRef = useRef(new Map<string, Mask>());
	const tokenOverridesRef = useRef({
		"0": { pattern: /\d/ },
		A: { pattern: /[a-zA-Z]/ },
	});

	const getMask = useCallback((mask: string) => {
		const cached = maskCacheRef.current.get(mask);
		if (cached) return cached;
		const created = new Mask({ mask, tokens: tokenOverridesRef.current });
		maskCacheRef.current.set(mask, created);
		return created;
	}, []);

	const applyMask = useCallback(
		(value: string, mask: string) => {
			if (!mask || mask.trim() === "") return value;
			return getMask(mask).masked(value);
		},
		[getMask],
	);

	const stripMask = useCallback(
		(value: string, mask?: string) => {
			if (!mask || mask.trim() === "") {
				return value.replaceAll(/[^0-9a-zA-Z]/g, "");
			}
			return getMask(mask).unmasked(value);
		},
		[getMask],
	);

	return { applyMask, stripMask };
}
