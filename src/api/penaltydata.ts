namespace Penalties {

  export interface gate {
    gateNumber: number;
    penalty: string;        // ジャッジ: スプレッドシートの4列目(1)～33列目(30)
    isLocked: boolean;      // ロック済: スプレッドシートの3列目
  };

  export interface section {
    race: string;           // レース名: スプレッドシートの1列目
    bib: number;            // ゼッケン: スプレッドシートの2列目
    isLocked: boolean;      // ロック済: スプレッドシートの3列目
    gates: gate[];          // 
    sheetRowIndex: number;  // スプレッドシートの行インデックス番号（0: 2行目, 1:3行目, ... 99: 101行目）
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
    const lastRow = sheet.getLastRow();
    if ((lastRow > 1) && (beginGate > 0) && (gateLength > 0) && ((beginGate + gateLength - 1) < 100)) {
      const rsRunners = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      const rsGates = sheet.getRange(2, 3 + beginGate, lastRow - 1, gateLength).getValues();
      rsRunners.forEach((runner, sheetRowIndex) => {
        const race: string = runner[0];
        const bib: number = Number(runner[1]);
        const isLocked = (runner[2] == '!')
        const gates: gate[] = [];
        rsGates[sheetRowIndex].forEach((penalty, gateIndex) => {
          const gate: gate = {
            gateNumber: beginGate + gateIndex,
            penalty,
            isLocked
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
    }
    return {
      sections,
    };
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
          });
        } else {
          section.gates.forEach(gate => {
            sheet.getRange(row, gate.gateNumber + 3).setValue(gate.penalty);
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