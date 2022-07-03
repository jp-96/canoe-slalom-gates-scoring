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
    let sheetData = Penalties.getSheetData('テストデータ', 3, 4);
    sheetData.sections.forEach(section => {
        section.gates[0].penalty = '0';
        section.gates[1].penalty = '2';
        section.gates[2].penalty = '50';
        section.gates[3].penalty = 'DNS';
    });
    Penalties.putSheetData('テストデータ', sheetData);
}