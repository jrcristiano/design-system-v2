/**
 * Tipos fundamentais do componente Stopwatch
 * @module Stopwatch.types
 */

import React from "react";

export type StopwatchValue = Readonly<{
	hours: number;
	minutes: number;
	seconds: number;
}>;

export type StopwatchState = "idle" | "running" | "paused" | "limit_reached";

export type StopwatchError = {
	code: "INVALID_VALUE" | "TIMER_OVERFLOW" | "LIMIT_EXCEEDED";
	message: string;
	timestamp: number;
};

export type TimeFormat = "HH:MM:SS" | "MM:SS" | "HH:MM";

// Props base (sem children) - para ser estendida
export interface StopwatchBaseProps {
	/** Valor inicial do cronômetro */
	defaultValue?: StopwatchValue;
	/** Valor controlado (modo controlado) */
	value?: StopwatchValue;
	/** Callback quando o valor muda */
	onChange?: (value: StopwatchValue) => void;
	/** Callback quando o estado muda */
	onStateChange?: (state: StopwatchState) => void;
	/** Callback quando ocorre um erro */
	onError?: (error: StopwatchError) => void;
	/** Se true, desabilita o componente */
	disabled?: boolean;
	/** Se true, inicia automaticamente */
	autoStart?: boolean;
	/** Limite máximo de tempo (opcional) */
	timeLimit?: StopwatchValue;
	/** Classe CSS adicional opcional */
	className?: string;
}

// Props para o Root Component (com children obrigatório)
export interface StopwatchRootProps extends StopwatchBaseProps {
	/** Children (compound components) - obrigatório */
	children: React.ReactNode;
}

// Props para o Hook (sem children - igual às base props)
export type StopwatchHookProps = StopwatchBaseProps;

export interface StopwatchDisplayProps {
	/** Classe CSS adicional */
	className?: string;
	/** Formato de exibição (padrão: 'HH:MM:SS') */
	format?: TimeFormat;
}

export interface StopwatchControlsProps {
	/** Classe CSS adicional */
	className?: string;
	/** Orientação dos controles */
	orientation?: "horizontal" | "vertical";
	/** Se true, mostra labels nos botões */
	showLabels?: boolean;
}

export interface StopwatchButtonProps {
	/** Tipo do botão */
	type: "play" | "pause" | "reset";
	/** Desabilitado */
	disabled?: boolean;
	/** Callback ao clicar */
	onClick?: () => void;
	/** Label do botão */
	label?: string;
	/** Classe CSS adicional */
	className?: string;
}

export interface StopwatchLabelProps {
	/** Texto do label */
	children: React.ReactNode;
	/** Classe CSS adicional */
	className?: string;
	/** Posição do label */
	position?: "top" | "bottom" | "left" | "right";
}

// Contexto para compound components
export interface StopwatchContextValue {
	value: StopwatchValue;
	state: StopwatchState;
	isRunning: boolean;
	isPaused: boolean;
	isLimitReached: boolean;
	disabled: boolean;
	timeLimit?: StopwatchValue;
	handlers: {
		onPlay: () => void;
		onPause: () => void;
		onReset: () => void;
	};
}

export const StopwatchContext = React.createContext<StopwatchContextValue | null>(null);
