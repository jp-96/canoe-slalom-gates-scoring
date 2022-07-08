import CanoeSlalomHeatData from "../dao/CanoeSlalomHeatData";

export default CanoeSlalomHeatService;
namespace CanoeSlalomHeatService {

    namespace CONSTS {
        export const DATA_HEADER_ROW1 = 1
        export const DATA_HEADER_ROW2 = 2
        /**
         * データ開始行
         */
        export const DATA_TOP_ROW = 3;
        /**
         * 選手データの開始列
         */
        export const RUNNER_COLUMN = 1;
        /**
         * [0] bib
         * [1] heat
         * [2] isLocked
         */
        export const RUNNER_LENGTH = 3;
        /**
         * スタートタイムの開始列
         */
        export const START_COLUMN = 4;
        /**
         * [0] hours
         * [1] minutes
         * [2] seconds
         * [3] judge
         */
        export const START_LENGTH = 4;
        /**
         * フィニッシュタイムの開始列
         */
        export const FINISH_COLUMN = 8;
        /**
         * [0] hours
         * [1] minutes
         * [2] seconds
         * [3] judge
         */
        export const FINISH_LENGTH = 4;
        /**
         * ゲート判定の開始列
         */
        export const GATE_COLUMN = 12;
        /**
         * 最大ゲート番号
         */
        export const GATE_MAX = 30;
    }

    export function createNewSheet(sheetName: string) {
        const spread = SpreadsheetApp.getActiveSpreadsheet()
        const sheet = spread.insertSheet(sheetName, spread.getSheets().length);
        // 選手データ
        sheet.getRange(CONSTS.DATA_HEADER_ROW1, CONSTS.RUNNER_COLUMN).setValue('RUNNER');
        sheet.getRange(CONSTS.DATA_HEADER_ROW2, CONSTS.RUNNER_COLUMN, 1, CONSTS.RUNNER_LENGTH).setValues([
            [
                'bib',
                'heat',
                'isLocked',
            ]
        ]);
        // スタートタイム
        sheet.getRange(CONSTS.DATA_HEADER_ROW1, CONSTS.START_COLUMN).setValue('START');
        sheet.getRange(CONSTS.DATA_HEADER_ROW2, CONSTS.START_COLUMN, 1, CONSTS.START_LENGTH).setValues([
            [
                'hours',
                'minutes',
                'seconds',
                'judge',
            ]
        ]);
        // フィニッシュタイム
        sheet.getRange(CONSTS.DATA_HEADER_ROW1, CONSTS.FINISH_COLUMN).setValue('FINISH');
        sheet.getRange(CONSTS.DATA_HEADER_ROW2, CONSTS.FINISH_COLUMN, 1, CONSTS.FINISH_LENGTH).setValues([
            [
                'hours',
                'minutes',
                'seconds',
                'judge',
            ]
        ]);
        // ゲート判定
        sheet.getRange(CONSTS.DATA_HEADER_ROW1, CONSTS.GATE_COLUMN).setValue('GATE');
        sheet.getRange(CONSTS.DATA_HEADER_ROW2, CONSTS.GATE_COLUMN, 1, CONSTS.GATE_MAX).setValues([
            [...Array(CONSTS.GATE_MAX)].map((_, i) => `[${i + 1}]`)
        ]);
        // スクロール固定
        sheet.setFrozenRows(CONSTS.DATA_HEADER_ROW2);
        sheet.setFrozenColumns(CONSTS.RUNNER_LENGTH);
        return sheet;
    }

    /**
     * データセット取得条件
     */
    export type Criteria = {
        /**
         * シート名
         */
        sheetName: string;
        /**
         * スタートタイムの要求
         */
        started?: boolean;
        /**
         * ゴールタイムの要求
         */
        finished?: boolean;
        /**
         * ゲート判定の要求
         */
        gates?: {
            /**
             * 開始ゲート番号
             */
            beginGate: number;
            /**
             * 要求ゲート数
             */
            gateLength: number;
        };
    }

    /**
     * スプレッドシートの取得
     * @param sheetName シート名
     * @returns スプレッドシート
     */
    function getSheet(sheetName: string) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (!sheet) {
            throw new Error(`Missing sheet: '${sheetName}'`);
        }
        return sheet;
    }

    /**
     * データ件数の取得
     * @param sheet スプレッドシート
     * @returns 1以上
     */
    function getRowCount(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        const rowCount = sheet.getLastRow() - (CONSTS.DATA_TOP_ROW - 1);
        if (rowCount < 1) {
            throw new Error(`No records.`);
        }
        return rowCount;
    }

    /**
     * データセットの取得
     * @param criteria 取得条件
     * @returns データセット
     */
    export function getDataset(criteria: Criteria) {
        const sheet = getSheet(criteria.sheetName);
        const rowCount = getRowCount(sheet);
        const dataset: CanoeSlalomHeatData.Dataset = {
            sheetName: criteria.sheetName,
            runners: [],
        };
        const rsLocked: boolean[] = []; // isLockedの一時リスト

        (() => {
            // 選手データリストの取得
            const rs = sheet.getRange(CONSTS.DATA_TOP_ROW, CONSTS.RUNNER_COLUMN, rowCount, CONSTS.RUNNER_LENGTH).getValues();
            rs.forEach((r, i) => {
                const runner: CanoeSlalomHeatData.runner = {
                    row: i,
                    bib: String(r[0]),
                    heat: String(r[1]),
                };
                rsLocked.push(String(r[2]) != '');  // isLocked
                dataset.runners.push(runner);
            });
        })();

        if (criteria.started) {
            // スタートタイム
            const rs = sheet.getRange(CONSTS.DATA_TOP_ROW, CONSTS.START_COLUMN, rowCount, CONSTS.START_LENGTH).getValues();
            rs.forEach((r, i) => {
                const runner = dataset.runners[i];
                const hms = {
                    hours: r[0],
                    minutes: r[1],
                    seconds: r[2],
                }
                const seconds = CanoeSlalomHeatData.hmsToSeconds(hms);
                runner.started = {
                    seconds,
                    judge: String(r[3]),
                    fetching: {},
                };
                if (rsLocked[i]) {
                    // isLocked
                    runner.started.isLocked = true;
                }
            });
        }

        if (criteria.finished) {
            // フィニッシュタイム
            const rs = sheet.getRange(CONSTS.DATA_TOP_ROW, CONSTS.FINISH_COLUMN, rowCount, CONSTS.FINISH_LENGTH).getValues();
            rs.forEach((r, i) => {
                const runner = dataset.runners[i];
                const hms = {
                    hours: r[0],
                    minutes: r[1],
                    seconds: r[2],
                }
                const seconds = CanoeSlalomHeatData.hmsToSeconds(hms);
                runner.finished = {
                    seconds,
                    judge: String(r[3]),
                    fetching: {},
                };
                if (rsLocked[i]) {
                    // isLocked
                    runner.finished.isLocked = true;
                }
            });
        }

        if (criteria.gates) {
            // ゲート判定
            const beginGate = criteria.gates.beginGate;
            const gateLength = criteria.gates.gateLength;
            if ((beginGate < 1)
                || (gateLength < 1)
                || ((beginGate + gateLength - 1) > CONSTS.GATE_MAX)
            ) {
                throw new Error(`Invalid gates: ${beginGate} (${gateLength})`);
            }
            const column = CONSTS.GATE_COLUMN + beginGate - 1;
            const rs = sheet.getRange(CONSTS.DATA_TOP_ROW, column, rowCount, gateLength).getValues();
            rs.forEach((r, i) => {
                const gates: CanoeSlalomHeatData.gate[] = [];
                r.forEach((g, j) => {
                    const num = beginGate + j;
                    const judge = String(g);
                    const gate: CanoeSlalomHeatData.gate = {
                        num,
                        judge,
                        fetching: {},
                    }
                    if (rsLocked[i]) {
                        // isLocked
                        gate.isLocked = true;
                    }
                    gates.push(gate);
                });
                dataset.runners[i].gates = gates;
            });
        }

        return dataset;
    }

    export function putDataSingle(dataset: CanoeSlalomHeatData.Dataset) {
        const sheetName = dataset.sheetName;
        const sheet = getSheet(sheetName);
        const rowCount = getRowCount(sheet);
        const firstRunner = dataset.runners[0];
        const row = firstRunner.row;
        const sheetRow = CONSTS.DATA_TOP_ROW + row;
        if (row >= rowCount) {
            throw new Error('Invalid row: ${row}');
        }
        let runner: CanoeSlalomHeatData.runner;
        let isFailure = false;
        let isLocked = false;
        (() => {
            // 選手データリストの取得
            const r = sheet.getRange(sheetRow, CONSTS.RUNNER_COLUMN, 1, CONSTS.RUNNER_LENGTH).getValues()[0];
            runner = {
                row,
                bib: String(r[0]),
                heat: String(r[1]),
            }
            if ((runner.bib != firstRunner.bib) || (runner.heat != firstRunner.heat)) {
                isFailure = true;
            }
            if (String(r[2]) != '') {
                isFailure = true;
                isLocked = true;
            }
        })();
        if (firstRunner.started) {
            // スタートタイムの更新

            throw new Error('ToDo: putDataSingle - スタートタイムの更新');

        } else if (firstRunner.finished) {
            // フィニッシュタイムの更新

            throw new Error('ToDo: putDataSingle - フィニッシュタイムの更新');

        } else if (firstRunner.gates) {
            // ゲート判定の更新
            const firstGate = firstRunner.gates[0];
            const num = firstGate.num;
            const range = sheet.getRange(sheetRow, num + CONSTS.GATE_COLUMN - 1);
            let judge;
            if ((isFailure) || (isLocked)) {
                judge = range.getValue();
            } else {
                judge = firstGate.judge;
                range.setValue(judge);
            }
            const gate: CanoeSlalomHeatData.gate = {
                num,
                judge,
                fetching: {},
            };
            if (isLocked) {
                gate.isLocked = isLocked;
            }
            if (isFailure) {
                gate.fetching = { isFailure };
            }
            runner.gates = [
                gate,
            ]
        } else {
            // 対象なし
            throw new Error('No objects for putDataSingle.');
        }
        const updated: CanoeSlalomHeatData.Dataset = {
            sheetName,
            runners: [runner],
        };
        return updated;
    }
}