/**
 * Funções utilitárias puras para o Stopwatch
 * @module Stopwatch.utils
 */

import type { StopwatchValue, StopwatchError } from "./Stopwatch.types";
import { MAX_VALID_VALUES, ERROR_CODES } from "./Stopwatch.constants";

/**
 * Converte objeto de duração para segundos totais
 * @pure
 */
export const durationToSeconds = (duration: StopwatchValue): number => {
	return duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
};

/**
 * Converte segundos totais para objeto de duração
 * @pure
 */
export const secondsToDuration = (totalSeconds: number): StopwatchValue => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { hours, minutes, seconds };
};

/**
 * Formata número com padding de zero
 * @pure
 */
export const padZero = (num: number): string => {
	return String(num).padStart(2, "0");
};

// Type guard para o formato
type TimeFormat = "HH:MM:SS" | "MM:SS" | "HH:MM";

/**
 * Formata duração para string no formato especificado
 * @pure
 */
export const formatDuration = (
	duration: StopwatchValue,
	format: TimeFormat = "HH:MM:SS",
): string => {
	const { hours, minutes, seconds } = duration;

	if (format === "MM:SS") {
		const totalMinutes = hours * 60 + minutes;
		return `${padZero(totalMinutes)}:${padZero(seconds)}`;
	}

	if (format === "HH:MM") {
		return `${padZero(hours)}:${padZero(minutes)}`;
	}

	// HH:MM:SS (default)
	return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

/**
 * Valida se um valor é um StopwatchValue válido
 * @pure
 */
export const isValidStopwatchValue = (value: unknown): value is StopwatchValue => {
	if (!value || typeof value !== "object") return false;

	const obj = value as Record<string, unknown>;

	const isValidNumber = (num: unknown): num is number =>
		typeof num === "number" && num >= 0 && Number.isFinite(num) && !Number.isNaN(num);

	return (
		isValidNumber(obj.hours) &&
		obj.hours <= MAX_VALID_VALUES.hours &&
		isValidNumber(obj.minutes) &&
		obj.minutes <= MAX_VALID_VALUES.minutes &&
		isValidNumber(obj.seconds) &&
		obj.seconds <= MAX_VALID_VALUES.seconds
	);
};

/**
 * Adiciona um segundo a uma duração
 * @pure
 */
export const addSecond = (duration: StopwatchValue): StopwatchValue => {
	const totalSeconds = durationToSeconds(duration) + 1;
	return secondsToDuration(totalSeconds);
};

/**
 * Compara duas durações
 * @pure retorna -1 se a < b, 0 se igual, 1 se a > b
 */
export const compareDurations = (a: StopwatchValue, b: StopwatchValue): number => {
	const secondsA = durationToSeconds(a);
	const secondsB = durationToSeconds(b);

	if (secondsA < secondsB) return -1;
	if (secondsA > secondsB) return 1;
	return 0;
};

/**
 * Verifica se uma duração atingiu/ultrapassou o limite
 * @pure
 */
export const hasReachedLimit = (current: StopwatchValue, limit?: StopwatchValue): boolean => {
	if (!limit) return false;

	const currentSeconds = durationToSeconds(current);
	const limitSeconds = durationToSeconds(limit);

	return limitSeconds > 0 && currentSeconds >= limitSeconds;
};

/**
 * Cria um erro estruturado
 * @pure
 */
export const createStopwatchError = (
	code: keyof typeof ERROR_CODES,
	message: string,
): StopwatchError => ({
	code: ERROR_CODES[code],
	message,
	timestamp: Date.now(),
});
