/**
 * Hook para gerenciar o timer do Stopwatch
 * @module useStopwatchTimer
 */

import { useEffect, useRef, useCallback } from "react";
import { TIMER_INTERVAL_MS } from "../Stopwatch.constants";

interface UseStopwatchTimerProps {
	isRunning: boolean;
	disabled: boolean;
	onTick: () => void;
	onError?: (error: Error) => void;
}

export const useStopwatchTimer = ({
	isRunning,
	disabled,
	onTick,
	onError,
}: UseStopwatchTimerProps): void => {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const lastTickRef = useRef<number>(Date.now());
	const tickCountRef = useRef<number>(0);

	const clearTimer = useCallback((): void => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const handleTick = useCallback(() => {
		try {
			const now = Date.now();
			const expectedTick = lastTickRef.current + TIMER_INTERVAL_MS;

			// Detecta drift significativo
			if (Math.abs(now - expectedTick) > TIMER_INTERVAL_MS * 0.5) {
				console.warn("Timer drift detected:", now - expectedTick, "ms");
			}

			onTick();
			lastTickRef.current = now;
			tickCountRef.current += 1;

			// Previne memory leak com muitas ticks
			if (tickCountRef.current > 3600) {
				// 1 hora
				throw new Error("Timer running for too long, possible memory leak");
			}
		} catch (error) {
			onError?.(error instanceof Error ? error : new Error("Timer tick failed"));
			clearTimer();
		}
	}, [onTick, onError, clearTimer]);

	useEffect(() => {
		if (!isRunning || disabled) {
			clearTimer();
			return;
		}

		if (!timerRef.current) {
			lastTickRef.current = Date.now();
			tickCountRef.current = 0;
			timerRef.current = setInterval(handleTick, TIMER_INTERVAL_MS);
		}

		return clearTimer;
	}, [isRunning, disabled, handleTick, clearTimer]);

	// Cleanup final
	useEffect(() => clearTimer, [clearTimer]);
};
