export default class BackTracker {
  private _played: [number, number][] = [];
  private _undone: [number, number][] = [];
  private _discarded: Map<number, Set<number>> = new Map();

  play(index: number, value: number) {
    this._played.push([index, value]);
    this._undone = [];

    if (!this._discarded.has(index)) {
      this._discarded.delete(index);
    }
  }

  erase(index: number) {
    this._played = this._played.filter(([i]) => i !== index);
    this._undone = [];
  }

  undo(): [number, number] | undefined {
    const lastPlay = this._played.pop();
    if (lastPlay) {
      this._undone.push(lastPlay);
    }

    return lastPlay;
  }

  redo(): [number, number] | undefined {
    const lastUndo = this._undone.pop();
    if (lastUndo) {
      this._played.push(lastUndo);
    }

    return lastUndo;
  }

  discard(index: number, value: number) {
    if (!this._discarded.has(index)) {
      this._discarded.set(index, new Set());
    }

    this._discarded.get(index)!.add(value);
  }

  undiscard(index: number, value: number) {
    this._discarded.get(index)?.delete(value);
  }

  clearDiscarded() {
    this._discarded.clear();
  }

  clear() {
    this._played = [];
    this._undone = [];
    this._discarded.clear();
  }

  get played(): [number, number][] {
    return [...this._played];
  }

  get undone(): [number, number][] {
    return [...this._undone];
  }

  get discarded(): Map<number, Set<number>> {
    return this._discarded;
  }
}
