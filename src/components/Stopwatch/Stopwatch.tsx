import React, { useState, useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { PlayCircleIcon, PauseCircleIcon, ClockClockwiseIcon } from "@phosphor-icons/react";
import type { StopwatchProps, StopwatchValue } from "./Stopwatch.interface";

const durationToSeconds = (duration: StopwatchValue): number => {
	return duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
};

const secondsToDuration = (totalSeconds: number): StopwatchValue => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return { hours, minutes, seconds };
};

const padZero = (num: number): string => String(num).padStart(2, "0");

export const Stopwatch: React.FC<StopwatchProps> = ({
	label,
	value,
	defaultValue = { hours: 0, minutes: 0, seconds: 0 },
	onChange,
	disabled = false,
	className,
	autoStart = false,
	showControls = true,
	onStart,
	onPause,
	onReset,
}) => {
	const [isRunning, setIsRunning] = useState(autoStart);
	const [stopwatchTime, setStopwatchTime] = useState<StopwatchValue>(defaultValue);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Limite de tempo (opcional) - apenas 'value' define o limite, não 'defaultValue'
	const timeLimit = useMemo(() => value || { hours: 0, minutes: 0, seconds: 0 }, [value]);

	// Gerenciar o intervalo do cronômetro
	useEffect(() => {
		if (isRunning && !disabled) {
			timerRef.current = setInterval(() => {
				setStopwatchTime((prev) => {
					const newSeconds = durationToSeconds(prev) + 1;
					const limitSeconds = durationToSeconds(timeLimit);

					// Se atingir o limite, parar e retornar o limite exato
					if (limitSeconds > 0 && newSeconds >= limitSeconds) {
						setIsRunning(false);
						onPause?.();
						const limitValue = secondsToDuration(limitSeconds);
						onChange?.(limitValue);
						return limitValue;
					}

					const newValue = secondsToDuration(newSeconds);
					onChange?.(newValue);
					return newValue;
				});
			}, 1000);

			return () => {
				if (timerRef.current) clearInterval(timerRef.current);
			};
		}

		// Limpar intervalo quando pausado ou desabilitado
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, [isRunning, disabled, timeLimit, onChange, onPause]);

	const handleStart = () => {
		if (disabled) return;
		setIsRunning(true);
		onStart?.();
	};

	const handlePause = () => {
		if (disabled) return;
		setIsRunning(false);
		onPause?.();
	};

	const handleReset = () => {
		if (disabled) return;
		setIsRunning(false);
		const resetValue = { hours: 0, minutes: 0, seconds: 0 };
		setStopwatchTime(resetValue);
		onChange?.(resetValue);
		onReset?.();
	};

	const formattedTime = useMemo(() => {
		return `${padZero(stopwatchTime.hours)}:${padZero(stopwatchTime.minutes)}:${padZero(stopwatchTime.seconds)}`;
	}, [stopwatchTime]);

	return (
		<div className={clsx("inline-flex flex-col items-center gap-2", className)}>
			<div
				className={clsx(
					"inline-flex items-center justify-center rounded-xl p-4",
					"outline outline-1 outline-offset-[-1px]",
					{
						"bg-white outline-[var(--ds-color-neutral-50)]":
							!disabled && !isRunning && durationToSeconds(stopwatchTime) === 0,
						"bg-white outline-[var(--ds-color-blue-40)]": !disabled && isRunning,
						"bg-[var(--ds-color-blue-90)] outline-[var(--ds-color-blue-10)]":
							!disabled && !isRunning && durationToSeconds(stopwatchTime) > 0,
						"bg-[var(--ds-color-neutral-80)] outline-[var(--ds-color-neutral-80)] cursor-not-allowed":
							disabled,
					},
				)}
			>
				<span
					className={clsx("font-poppins text-base font-medium leading-none", {
						"text-[var(--ds-color-neutral-10)]":
							!disabled && durationToSeconds(stopwatchTime) === 0,
						"text-[var(--ds-color-blue-30)]":
							!disabled && (durationToSeconds(stopwatchTime) > 0 || isRunning),
						"text-[var(--ds-color-neutral-40)]": disabled,
					})}
				>
					{formattedTime}
				</span>
			</div>

			{showControls && (
				<div className="flex items-center gap-1.5">
					{(() => {
						const currentSeconds = durationToSeconds(stopwatchTime);
						const limitSeconds = durationToSeconds(timeLimit);
						const hasReachedLimit = limitSeconds > 0 && currentSeconds >= limitSeconds;

						if (hasReachedLimit) {
							return (
								<>
									<button
										type="button"
										onClick={handleReset}
										disabled={disabled}
										className={clsx(
											"inline-flex items-center justify-center p-0 transition-colors bg-transparent border-0",
											{
												"text-[var(--ds-color-neutral-10)] hover:text-[var(--ds-color-blue-30)] cursor-pointer":
													!disabled,
												"text-[var(--ds-color-neutral-40)] cursor-not-allowed": disabled,
											},
										)}
										aria-label="Resetar"
									>
										<ClockClockwiseIcon size={20} weight="bold" />
									</button>
									<span
										className={clsx("text-xs font-normal leading-[18px]", {
											"text-[var(--ds-color-neutral-10)]": !disabled,
											"text-[var(--ds-color-neutral-40)]": disabled,
										})}
									>
										Redefinir
									</span>
								</>
							);
						}

						if (isRunning) {
							return (
								<>
									<button
										type="button"
										onClick={handlePause}
										disabled={disabled}
										className={clsx(
											"inline-flex items-center justify-center p-0 transition-colors bg-transparent border-0",
											{
												"text-[var(--ds-color-neutral-10)] hover:text-[var(--ds-color-blue-30)] cursor-pointer":
													!disabled,
												"text-[var(--ds-color-neutral-40)] cursor-not-allowed": disabled,
											},
										)}
										aria-label="Pausar"
									>
										<PauseCircleIcon size={20} weight="fill" />
									</button>
									<span
										className={clsx("text-xs font-normal leading-[18px]", {
											"text-[var(--ds-color-neutral-10)]": !disabled,
											"text-[var(--ds-color-neutral-40)]": disabled,
										})}
									>
										Pausar
									</span>
								</>
							);
						}

						if (currentSeconds > 0) {
							return (
								<>
									<div className="flex flex-col gap-0.5">
										<button
											type="button"
											onClick={handleStart}
											disabled={disabled}
											className={clsx(
												"inline-flex items-center justify-center p-0 transition-colors bg-transparent border-0",
												{
													"text-[var(--ds-color-neutral-10)] hover:text-[var(--ds-color-blue-30)] cursor-pointer":
														!disabled,
													"text-[var(--ds-color-neutral-40)] cursor-not-allowed": disabled,
												},
											)}
											aria-label="Iniciar"
										>
											<PlayCircleIcon size={20} weight="fill" />
										</button>
										<button
											type="button"
											onClick={handleReset}
											disabled={disabled}
											className={clsx(
												"inline-flex items-center justify-center p-0 transition-colors bg-transparent border-0",
												{
													"text-[var(--ds-color-neutral-10)] hover:text-[var(--ds-color-blue-30)] cursor-pointer":
														!disabled,
													"text-[var(--ds-color-neutral-40)] cursor-not-allowed": disabled,
												},
											)}
											aria-label="Resetar"
										>
											<ClockClockwiseIcon size={20} weight="bold" />
										</button>
									</div>
									<div className="flex flex-col gap-0.5">
										<span
											className={clsx("text-xs font-normal leading-[18px]", {
												"text-[var(--ds-color-neutral-10)]": !disabled,
												"text-[var(--ds-color-neutral-40)]": disabled,
											})}
										>
											Iniciar
										</span>
										<span
											className={clsx("text-xs font-normal leading-[18px]", {
												"text-[var(--ds-color-neutral-10)]": !disabled,
												"text-[var(--ds-color-neutral-40)]": disabled,
											})}
										>
											Redefinir
										</span>
									</div>
								</>
							);
						}

						return (
							<>
								<button
									type="button"
									onClick={handleStart}
									disabled={disabled}
									className={clsx(
										"inline-flex items-center justify-center p-0 transition-colors bg-transparent border-0",
										{
											"text-[var(--ds-color-neutral-10)] hover:text-[var(--ds-color-blue-30)] cursor-pointer":
												!disabled,
											"text-[var(--ds-color-neutral-40)] cursor-not-allowed": disabled,
										},
									)}
									aria-label="Iniciar"
								>
									<PlayCircleIcon size={20} weight="fill" />
								</button>
								<span
									className={clsx("text-xs font-normal leading-[18px]", {
										"text-[var(--ds-color-neutral-10)]": !disabled,
										"text-[var(--ds-color-neutral-40)]": disabled,
									})}
								>
									Iniciar
								</span>
							</>
						);
					})()}
				</div>
			)}

			{label && (
				<span
					className={clsx("text-xs font-normal leading-[18px]", {
						"text-[var(--ds-color-neutral-10)]": !disabled,
						"text-[var(--ds-color-neutral-40)]": disabled,
					})}
				>
					{label}
				</span>
			)}
		</div>
	);
};

Stopwatch.displayName = "Stopwatch";
