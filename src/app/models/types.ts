import { type SubPartModes } from "../modules/math-actions/templates/part-substitution";
import { type Multiplier } from "../modules/math-structures/math-structure";
import { type Term } from "../modules/math-structures/term";

export interface FormulaReplacement { from: Term | Multiplier, to: Term | Multiplier }

export type Simplification = "like-terms" | "distribute" | "frac";

export type Simplifications = Record<string, Simplification>;

export interface FormulaActionConfig {
    id: string
    categoryId: number
    template: boolean
    type: "formula" | "expression"
    name: string
    body?: string[]
    requireInput?: boolean
    simp?: Simplifications
    description?: string
}

export interface FormulaDefinition {
    id: string
    categoryId: number
    text: string
    formula: string
}

export interface HotkeyConfigs {
    id: string
    key: string
    ctrl: boolean
    alt: boolean
    shift: boolean
}

export interface ActionHotkeyConfig extends HotkeyConfigs {
    options: {
        mode: SubPartModes
        requireInput?: boolean
    }
}
