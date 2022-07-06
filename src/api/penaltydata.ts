namespace Penalties {

  export interface gate {
    gateNumber: number;     // <<PK>> ゲート番号
    penalty: string;        // ジャッジ: スプレッドシートの4列目(1)～33列目(30)
    isLocked: boolean;      // ロック済: スプレッドシートの3列目
    savedPenalty: string;   // 保存済みのジャッジ
  };

  export interface section {
    sheetRowIndex: number;  // <<PK>> スプレッドシートの行インデックス番号（0: 2行目, 1:3行目, ... 99: 101行目）
    race: string;           // レース名: スプレッドシートの1列目
    bib: number;            // ゼッケン: スプレッドシートの2列目
    isLocked: boolean;      // ロック済: スプレッドシートの3列目
    gates: gate[];          // 
  }

  export interface SheetData {
    sections: section[];
  }

  export function getSheetData(sheetName: string, beginGate: number, gateLength: number): SheetData {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Missing sheet: '${sheetName}'`);
    }
    const sections: section[] = [];
    const sheetData: SheetData = { sections, };
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
          savedPenalty: penalty,
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
  };

  export function putSheetData(sheetName: string, sheetData: SheetData): SheetData {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Missing sheet: '${sheetName}'`);
    }
    sheetData.sections.forEach(section => {
      const row = section.sheetRowIndex + 2;
      const runner = sheet.getRange(row, 1, 1, 3).getValues()[0];
      const race: string = runner[0];
      const bib: number = Number(runner[1]);
      const isLocked = (runner[2] == '!')
      if ((section.race == race) && (section.bib == bib)) {
        if (isLocked) {
          section.isLocked = true;
          section.gates.forEach(gate => {
            gate.isLocked = true;
            gate.penalty = sheet.getRange(row, gate.gateNumber + 3).getValue();
            gate.savedPenalty = gate.penalty;
          });
        } else {
          section.gates.forEach(gate => {
            sheet.getRange(row, gate.gateNumber + 3).setValue(gate.penalty);
            gate.savedPenalty = gate.penalty;
          });
        }
      } else {
        throw new Error(`Missing runner: '${sheetName}' ${section.race}/${section.bib}`);
      }
    });
    return sheetData;
  };

}

export default Penalties;