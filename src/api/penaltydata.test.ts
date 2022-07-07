import Penalties from "./penaltydata";

function testGetSheetData() {
    const sheetData = Penalties.getSheetData('テストデータ', 1, 99);
    Logger.log(sheetData.sections.length);
    Logger.log(sheetData.sections[0].gates.length);
    const sheetData2 = Penalties.getSheetData('テストデータ', 1, 10);
    Logger.log(sheetData2);
    const sheetData3 = Penalties.getSheetData('テストデータ', 99, 1);
    Logger.log(sheetData3);
}

function testPutSheetData() {
    const sheetData = Penalties.getSheetData('テストデータ', 3, 4);

    const targetSection = sheetData.sections[1];    // 2番目
    const targetGate = targetSection.gates[2];      // 3番目：ゲート5
    const singleSheetData: Penalties.SheetData = {
        sheetName: sheetData.sheetName,
        sections: [{
            ...targetSection,
            gates: [{
                ...targetGate,
                penalty: '2',
            }]
        }],
    };

    Penalties.putSingleData(singleSheetData);
}