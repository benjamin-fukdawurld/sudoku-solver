export function* rowIndexGenerator(
  rowIndex: number
): Generator<number, void, void> {
  for (let col = 0; col < 9; col++) {
    yield rowIndex * 9 + col;
  }
}

export function* colIndexGenerator(
  colIndex: number
): Generator<number, void, void> {
  for (let row = 0; row < 9; row++) {
    yield row * 9 + colIndex;
  }
}

export function* squareIndexGenerator(
  squareIndex: number
): Generator<number, void, void> {
  const startRow = Math.floor(squareIndex / 3) * 3;
  const startCol = (squareIndex % 3) * 3;
  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      yield row * 9 + col;
    }
  }
}

export function* allIndicesGenerator(
  type: "row" | "col" | "square" = "row"
): Generator<number, void, void> {
  if (type === "row") {
    for (let index = 0; index < 81; index++) {
      yield index;
    }

    return;
  }

  const generator = type === "col" ? colIndexGenerator : squareIndexGenerator;
  const indices = Array.from({ length: 9 }, (_, i) => [...generator(i)]).flat();
  for (const i of indices) {
    yield i;
  }
}

export function makeSubGridIterator(
  index: number,
  generator: (index: number) => Generator<number, void, void>
): Iterator<number, void, void> & Iterable<number> {
  const gen = generator(index);
  return {
    next: () => gen.next(),
    [Symbol.iterator]() {
      return this;
    },
  };
}

export function makeColIterator(
  colIndex: number
): Iterator<number, void, void> & Iterable<number> {
  return makeSubGridIterator(colIndex, colIndexGenerator);
}

export function makeRowIterator(
  rowIndex: number
): Iterator<number, void, void> & Iterable<number> {
  return makeSubGridIterator(rowIndex, rowIndexGenerator);
}

export function makeSquareIterator(
  squareIndex: number
): Iterator<number, void, void> & Iterable<number> {
  return makeSubGridIterator(squareIndex, squareIndexGenerator);
}

export function makeAllIndicesIterator(
  type: "row" | "col" | "square" = "row"
): Iterator<number, void, void> & Iterable<number> {
  const gen = allIndicesGenerator(type);
  return {
    next: () => gen.next(),
    [Symbol.iterator]() {
      return this;
    },
  };
}
