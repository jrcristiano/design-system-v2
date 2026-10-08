import { describe, it, expect } from "vitest";

import {
	DEFAULT_STOPWATCH_VALUE,
	TIMER_INTERVAL_MS,
	MAX_VALID_VALUES,
	STOPWATCH_STATES,
	CONTROL_LABELS,
	TIME_FORMATS,
	STOPWATCH_COLORS,
	ERROR_CODES,
} from "../Stopwatch.constants";

describe("Stopwatch.constants", () => {
	describe("DEFAULT_STOPWATCH_VALUE", () => {
		it("deve iniciar em zero absoluto", () => {
			expect(DEFAULT_STOPWATCH_VALUE).toEqual({
				hours: 0,
				minutes: 0,
				seconds: 0,
			});
		});

		it("não deve exceder limites máximos", () => {
			expect(DEFAULT_STOPWATCH_VALUE.hours).toBeLessThanOrEqual(MAX_VALID_VALUES.hours);
			expect(DEFAULT_STOPWATCH_VALUE.minutes).toBeLessThanOrEqual(MAX_VALID_VALUES.minutes);
			expect(DEFAULT_STOPWATCH_VALUE.seconds).toBeLessThanOrEqual(MAX_VALID_VALUES.seconds);
		});
	});

	describe("TIMER_INTERVAL_MS", () => {
		it("deve ser 1000ms (1 segundo)", () => {
			expect(TIMER_INTERVAL_MS).toBe(1000);
		});

		it("deve ser positivo", () => {
			expect(TIMER_INTERVAL_MS).toBeGreaterThan(0);
		});
	});

	describe("MAX_VALID_VALUES", () => {
		it("deve respeitar formato HH:MM:SS máximo", () => {
			expect(MAX_VALID_VALUES).toEqual({
				hours: 99,
				minutes: 59,
				seconds: 59,
			});
		});

		it("deve manter minutos e segundos abaixo de 60", () => {
			expect(MAX_VALID_VALUES.minutes).toBeLessThan(60);
			expect(MAX_VALID_VALUES.seconds).toBeLessThan(60);
		});
	});

	describe("STOPWATCH_STATES", () => {
		it("deve conter todos os estados esperados", () => {
			expect(Object.values(STOPWATCH_STATES)).toEqual([
				"idle",
				"running",
				"paused",
				"limit_reached",
			]);
		});

		it("deve mapear chaves em uppercase corretamente", () => {
			expect(STOPWATCH_STATES.IDLE).toBe("idle");
			expect(STOPWATCH_STATES.RUNNING).toBe("running");
			expect(STOPWATCH_STATES.PAUSED).toBe("paused");
			expect(STOPWATCH_STATES.LIMIT_REACHED).toBe("limit_reached");
		});
	});

	describe("CONTROL_LABELS", () => {
		it("deve conter rótulos obrigatórios", () => {
			expect(CONTROL_LABELS).toMatchObject({
				play: expect.any(String),
				pause: expect.any(String),
				reset: expect.any(String),
			});
		});

		it("não deve conter chaves extras", () => {
			expect(Object.keys(CONTROL_LABELS).sort()).toEqual(["play", "pause", "reset"].sort());
		});
	});

	describe("TIME_FORMATS", () => {
		it("deve suportar formatos esperados", () => {
			expect(TIME_FORMATS).toEqual({
				"HH:MM:SS": "HH:MM:SS",
				"MM:SS": "MM:SS",
				"HH:MM": "HH:MM",
			});
		});
	});

	describe("STOPWATCH_COLORS", () => {
		it("deve conter estrutura background/text/button", () => {
			expect(STOPWATCH_COLORS).toHaveProperty("background");
			expect(STOPWATCH_COLORS).toHaveProperty("text");
			expect(STOPWATCH_COLORS).toHaveProperty("button");
		});

		it("background deve conter estados esperados", () => {
			expect(Object.keys(STOPWATCH_COLORS.background).sort()).toEqual(
				["idle", "running", "paused", "disabled"].sort(),
			);
		});

		it("text deve conter variantes esperadas", () => {
			expect(Object.keys(STOPWATCH_COLORS.text).sort()).toEqual(
				["primary", "secondary", "disabled"].sort(),
			);
		});

		it("button deve conter variantes esperadas", () => {
			expect(Object.keys(STOPWATCH_COLORS.button).sort()).toEqual(["enabled", "disabled"].sort());
		});

		it("todas as entradas devem ser strings não vazias", () => {
			const flatten = (obj: Record<string, any>): string[] =>
				Object.values(obj).flatMap((value) => (typeof value === "string" ? value : flatten(value)));

			const allValues = flatten(STOPWATCH_COLORS);

			allValues.forEach((value) => {
				expect(typeof value).toBe("string");
				expect(value.length).toBeGreaterThan(0);
			});
		});
	});

	describe("ERROR_CODES", () => {
		it("deve conter códigos esperados", () => {
			expect(ERROR_CODES).toEqual({
				INVALID_VALUE: "INVALID_VALUE",
				TIMER_OVERFLOW: "TIMER_OVERFLOW",
				LIMIT_EXCEEDED: "LIMIT_EXCEEDED",
			});
		});

		it("não deve conter valores duplicados", () => {
			const values = Object.values(ERROR_CODES);
			const unique = new Set(values);
			expect(unique.size).toBe(values.length);
		});
	});
});
