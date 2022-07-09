import CanoeSlalomHeatData from '../dao/CanoeSlalomHeatData';
import CanoeSlalomHeatService from './CanoeSlalomHeatService';

const UT_TEST_SHEET_NAME = 'UT-テスト'

function test_CreateNewSheet_CanoeSlalomHeatService() {
    const sheet = CanoeSlalomHeatService.createNewSheet(UT_TEST_SHEET_NAME);
    Logger.log(sheet.getSheetName());
}

function test_GetDataset_CanoeSlalomHeatService() {
    let criteria: CanoeSlalomHeatService.Criteria
    let dataset: CanoeSlalomHeatData.Dataset;
    criteria = {
        sheetName: UT_TEST_SHEET_NAME,
        gates: {
            beginGate: 1,
            gateLength: 30,
        },
    }
    dataset = CanoeSlalomHeatService.getDataset(criteria);
    Logger.log(dataset);
    criteria = {
        sheetName: UT_TEST_SHEET_NAME,
        gates: {
            beginGate: 1,
            gateLength: 1,
        },
    }
    dataset = CanoeSlalomHeatService.getDataset(criteria);
    Logger.log(dataset);

    dataset = CanoeSlalomHeatService.getDataset(criteria);
    Logger.log(dataset);
    criteria = {
        sheetName: UT_TEST_SHEET_NAME,
        gates: {
            beginGate: 30,
            gateLength: 1,
        },
    }
    dataset = CanoeSlalomHeatService.getDataset(criteria);
    Logger.log(dataset);

    dataset = CanoeSlalomHeatService.getDataset(criteria);
    Logger.log(dataset);
    criteria = {
        sheetName: UT_TEST_SHEET_NAME,
        gates: {
            beginGate: 13,
            gateLength: 5,
        },
    }
    dataset = CanoeSlalomHeatService.getDataset(criteria);
    Logger.log(dataset);

}

function test_PutDataSingle_CanoeSlalomHeatService() {
    const criteria: CanoeSlalomHeatService.Criteria = {
        sheetName: UT_TEST_SHEET_NAME,
        gates: {
            beginGate: 1,
            gateLength: 30,
        },
    }
    const dataset = CanoeSlalomHeatService.getDataset(criteria);

    let run: CanoeSlalomHeatData.run;
    let runner: CanoeSlalomHeatData.runner;
    let gate: CanoeSlalomHeatData.gate;

    let modGate: CanoeSlalomHeatData.gate;
    let modRunner: CanoeSlalomHeatData.runner;
    let modRun: CanoeSlalomHeatData.run;
    let modDataset: CanoeSlalomHeatData.Dataset;

    let result: CanoeSlalomHeatData.Dataset;

    run = dataset.runs[0];
    runner = run.runner;
    if (run.gates) {
        gate = run.gates[29];

        modGate = {
            num: gate.num,
            judge: '0',
            fetching: {},
        }

        modRunner = {
            row: runner.row,
            bib: runner.bib,
            heat: runner.heat,
        }

        modRun = {
            runner: modRunner,
            gates: [modGate,],
        };

        modDataset = {
            sheetName: dataset.sheetName,
            runs: [modRun,],
        };
        result = CanoeSlalomHeatService.putDataSingle(modDataset);
        Logger.log(result);
    }
}