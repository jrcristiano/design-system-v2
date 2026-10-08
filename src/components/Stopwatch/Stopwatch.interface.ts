export interface StopwatchValue {
	hours: number;
	minutes: number;
	seconds: number;
}

export interface StopwatchProps {
	/** Label do campo */
	label?: string;
	/** Valor controlado da duração (limite máximo) */
	value?: StopwatchValue;
	/** Valor padrão inicial */
	defaultValue?: StopwatchValue;
	/** Callback executado quando o valor muda */
	onChange?: (value: StopwatchValue) => void;
	/** Componente desabilitado */
	disabled?: boolean;
	/** Classe CSS adicional */
	className?: string;
	/** Se true, inicia o cronômetro automaticamente */
	autoStart?: boolean;
	/** Controla a visibilidade dos botões de controle */
	showControls?: boolean;
	/** Callback executado quando o cronômetro inicia */
	onStart?: () => void;
	/** Callback executado quando o cronômetro pausa */
	onPause?: () => void;
	/** Callback executado quando o cronômetro reseta */
	onReset?: () => void;
}
