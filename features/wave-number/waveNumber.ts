function getParsedLine(line: string) {
  const columns = line.split(/\s+/);

  if (columns.length >= 3) {
    return [+columns[1], +columns[2]];
  }
}

async function getLvData(file: File) {
  const lines = [];

  const text = await file.text();
  const splitLines = text.split(/\r?\n/);

  for (const line of splitLines) {
    const parsedLine = getParsedLine(line);

    if (!parsedLine) continue;

    lines.push(parsedLine);
  }

  return lines;
}

export const readFirstTwoColumns = async (file: File) => {
  const data = getLvData(file);

  return data;
};

function getPreparedOutput(output: (number | string)[][]) {
  const preparedOutput = output.map((row) => row.join("\t")).join("\n");

  return preparedOutput;
}

export async function getWaveNumberFile(
  oddDataFile: File,
  evenDataFile: File,
  minWaveNumber: number,
  maxWaveNumber: number
) {
  const [evenData, oddData] = await Promise.all([
    getLvData(evenDataFile),
    getLvData(oddDataFile),
  ]);

  const output = getParsedDataWithWaveNumber(
    oddData,
    evenData,
    minWaveNumber,
    maxWaveNumber
  );
  const preparedOutput = getPreparedOutput(output);

  return preparedOutput;
}

export function getArrayOfAdjacentValues(value: number) {
  return [value - 1, value, value + 1];
}

export function getParsedDataWithWaveNumber(
  oddData: number[][],
  evenData: number[][],
  minWaveNumber: number,
  maxWaveNumber: number
) {
  const output: (number | string)[][] = [
    ["oddLevel", "oddJ", "evenLevel", "evenJ", "waveNumber"],
  ];

  for (const [oddJ, oddLevel] of oddData) {
    const searchJValues = new Set(getArrayOfAdjacentValues(+oddJ));

    for (const [evenJ, evenLevel] of evenData) {
      if (!searchJValues.has(evenJ)) continue;

      const waveNumber = Math.abs(oddLevel - evenLevel);

      if (waveNumber < minWaveNumber || waveNumber > maxWaveNumber) continue;

      const formattedWaveNumber = +(
        Math.round((waveNumber + Number.EPSILON) * 100) / 100
      ).toFixed(2);

      output.push([oddLevel, oddJ, evenLevel, evenJ, formattedWaveNumber]);
    }
  }

  return output;
}
