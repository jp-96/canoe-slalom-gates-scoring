namespace Penalties {

  export interface fetchStatus {
    isError?: boolean;
    isLoading?: boolean;
  }

  export interface gate {
    gateNumber: number;       // <<PK>> ゲート番号
    penalty: string;          // ジャッジ: スプレッドシートの4列目(1)～102列目(99)
    isLocked: boolean;        // ロック済: スプレッドシートの3列目
    fetchStatus: fetchStatus; // スプレッドシート反映状態
  };

  export type gates = gate[];

  export interface section {
    sheetRowIndex: number;  // <<PK>> スプレッドシートの行インデックス番号（0: 2行目, 1:3行目, ... 99: 101行目）
    race: string;           // レース名: スプレッドシートの1列目
    bib: number;            // ゼッケン: スプレッドシートの2列目
    isLocked: boolean;      // ロック済: スプレッドシートの3列目
    gates: gates;          // 
  }

  export type sections = section[];

  export interface SheetData {
    sheetName: string;
    sections: sections;
  }

  export function getSheetData(sheetName: string, beginGate: number, gateLength: number): SheetData {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Missing sheet: '${sheetName}'`);
    }
    const sections: section[] = [];
    const sheetData: SheetData = { sheetName, sections, };
    if ((beginGate < 1) || (gateLength < 1) || ((beginGate + gateLength - 1) > 99)) {
      return sheetData;
    }
    const rowCount = sheet.getLastRow() - 1;
    if (rowCount < 1) {
      return sheetData;
    }
    const rsRunners = sheet.getRange(2, 1, rowCount, 3).getValues();
    const rsGates = sheet.getRange(2, 3 + beginGate, rowCount, gateLength).getValues();
    rsRunners.forEach((runner, sheetRowIndex) => {
      const race: string = runner[0];
      const bib: number = Number(runner[1]);
      const isLocked = (runner[2] == '!')
      const gates: gate[] = [];
      rsGates[sheetRowIndex].forEach((penalty, gateIndex) => {
        const gate: gate = {
          gateNumber: beginGate + gateIndex,
          penalty,
          isLocked,
          fetchStatus: {},
        }
        gates.push(gate);
      });
      const section: section = {
        race,
        bib,
        isLocked,
        gates,
        sheetRowIndex,
      }
      sections.push(section);
    });
    return sheetData;
  }

  export function putSingleData(newSingleData: SheetData): SheetData {
    const sheetName = newSingleData.sheetName;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Missing sheet: '${sheetName}'`);
    }
    const section = newSingleData.sections[0];
    const sheetRowIndex = section.sheetRowIndex
    const race = section.race;
    const bib = section.bib;
    const row = sheetRowIndex + 2;
    const runner = sheet.getRange(row, 1, 1, 3).getValues()[0];
    const isLocked = (runner[2] == '!');
    if ((runner[0] != race) || (Number(runner[1] != bib))) {
      throw new Error(`Missing runner: '${sheetName}' (${sheetRowIndex})`);
    }
    const gate = section.gates[0];
    const gateNumber = gate.gateNumber;
    if ((gateNumber < 1) || (gateNumber > 99)) {
      throw new Error('Invalid gateNumber: ${gateNumber}');
    }
    let penalty = gate.penalty;
    const penaltyRange = sheet.getRange(row, gateNumber + 3)
    if (isLocked) {
      penalty = penaltyRange.getValue();
    } else {
      penaltyRange.setValue(penalty);
    }
    const singleData: SheetData = {
      sheetName,
      sections: [{
        sheetRowIndex,
        race,
        bib,
        isLocked,
        gates: [{
          gateNumber,
          penalty,
          isLocked,
          fetchStatus: {},
        }],
      }],
    }
    return singleData;
  }

}

export default Penalties;