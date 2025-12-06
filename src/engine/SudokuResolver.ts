import {
  getAllPossibleValues,
  getUniquePossibility,
  playSinglePossibilities,
} from "../ai/utils";
import type SudokuArray from "./SudokuArray";

type SudokuResolverStateName = "idle" | "solving" | "solved" | "unsolvable";

type ResolverStep = {
  index: number;
  value: number;
};

function resolverStepToString(step: ResolverStep): string {
  return `${step.index}-${step.value}`;
}

export default class SudokuResolver {
  private _sudoku: SudokuArray;

  private _state: SudokuResolverStateName;

  private _steps: ResolverStep[] = [];
  private _discardedSteps: Set<string> = new Set();

  constructor(sudoku: SudokuArray) {
    this._sudoku = sudoku;
    this._state = "idle";
  }

  get sudoku(): SudokuArray {
    return this._sudoku;
  }

  set sudoku(sudoku: SudokuArray) {
    this._sudoku = sudoku;
    this._state = "idle";
  }

  get state(): SudokuResolverStateName {
    return this._state;
  }

  playStep(step: ResolverStep): void {
    this._sudoku.set(step.index, step.value);
    this._steps.push(step);
  }

  popLastStep(): ResolverStep | undefined {
    const step = this._steps.pop();
    if (step) {
      this._sudoku.set(step.index, 0);
      this._discardedSteps.add(resolverStepToString(step));
    }
    return step;
  }

  step(): boolean {
    switch (this._state) {
      case "idle": {
        this.playSinglePossibilities(this.analyze());

        this._state = this._sudoku.isValid ? "solved" : "solving";
        return true;
      }

      case "solving": {
        const possibleValues = this.analyze();
        if (possibleValues.size === 0) {
          this._state = "unsolvable";
          return false;
        }

        let found = !!this.playSinglePossibilities(possibleValues);
        if (found) {
          this._state = this._sudoku.isValid ? "solved" : "solving";
          return true;
        }

        found = !!this.playUniquePossibilities(possibleValues);
        if (found) {
          this._state = this._sudoku.isValid ? "solved" : "solving";
          return true;
        }

        let pickedIndex: number | null = null;
        let pickedValues: number[] | null = null;
        while (pickedIndex === null) {
          possibleValues.forEach((values, index) => {
            if (!pickedValues || values.length < pickedValues.length) {
              pickedIndex = index;
              pickedValues = values;
            }
          });

          for (const value of pickedValues ?? []) {
            const stepStr = resolverStepToString({
              index: pickedIndex!,
              value,
            });
            if (!this._discardedSteps.has(stepStr)) {
              this._sudoku.set(pickedIndex!, value);
              this._steps.push({ index: pickedIndex!, value });
              found = true;
              break;
            }
          }

          if (!found) {
            // All possible values for the picked index have been discarded
            possibleValues.delete(pickedIndex!);
            pickedIndex = null;
            pickedValues = null;

            if (possibleValues.size === 0) {
              const lastStep = this._steps.pop();
              if (!lastStep) {
                this._state = "unsolvable";
                return false;
              }

              this._discardedSteps.add(resolverStepToString(lastStep));

              this._sudoku.set(lastStep.index, 0);
              return true;
            }
          }
        }

        this._state = this._sudoku.isValid ? "solved" : "solving";
        return true;
      }

      default:
        return false;
    }
  }

  private analyze(): Map<number, number[]> {
    return new Map<number, number[]>(getAllPossibleValues(this._sudoku));
  }

  private getSinglePossibilityIndices(
    possibleValues: Map<number, number[]>
  ): number[] {
    const indices: number[] = [];
    possibleValues.forEach((values, index) => {
      if (values.length === 1) {
        indices.push(index);
      }
    });
    return indices;
  }

  private playSinglePossibilities(
    possibleValues: Map<number, number[]>
  ): number {
    return playSinglePossibilities(this.sudoku, Array.from(possibleValues));
  }

  private playUniquePossibilities(
    possibleValues: Map<number, number[]>
  ): number {
    let played = 0;

    const entries = possibleValues.keys();

    for (const index of entries) {
      const unique = getUniquePossibility(this._sudoku, possibleValues, index);
      if (unique !== undefined) {
        this.playStep({ index, value: unique });
        possibleValues.delete(index);
        played++;
        return played;
      }
    }

    return played;
  }
}
