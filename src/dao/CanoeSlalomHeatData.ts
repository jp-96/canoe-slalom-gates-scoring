export default CanoeSlalomHeatData;
namespace CanoeSlalomHeatData {

    /**
     * 選手・タイム・ペナルティのデータセット
     */
    export type Dataset = {
        sheetName: string;  // シート名
        runners: runner[];  // 選手・タイム・ペナルティのレコードセット(要素数:1以上)
    }

    /**
     * 選手のタイムとペナルティのレコード
     */
    export type runner = {
        row: number;        // <PK> シートの行番号
        bib: string;        // ゼッケン番号
        heat: string;       // レース名
        started?: time;     // スタートタイム
        finished?: time;    // ゴールタイム
        gates?: gate[];     // ゲート判定(要素数:1以上) (<<PK>> ゲート番号)
    }

    /**
     * スタートタイム・ゴールタイム
     */
    export type time = {
        seconds: number;    // 秒(小数点以下3桁まで)
        judge: string;      // 判定 - '':未入力, 'ENT':入力済, 'DNS':非スタート, 'DNF':非ゴール
        isLocked?: LOCKED;  // データロック済みフラグ
        fetching: fetching;
    }

    /**
     * ゲート判定
     */
    export type gate = {
        num: number;        // <<PK>> ゲート番号(1～30)
        judge: string;      // 判定 - '', '0', '2', '50', 'DNF'
        isLocked?: LOCKED;  // データロック済みフラグ
        fetching: fetching;
    }

    /**
     * データロック済み状態
     */
    type LOCKED = true;

    /**
     * データ更新結果(何もなければ、成功)
     */
    type fetching = {
        isLoading?: IS_LOADING;     // データ通信中
        hasError?: HAS_ERROR;       // 処理エラーあり
        isFailure?: IS_FAILURE;     // 更新失敗
    }

    /**
     * データ通信中状態
     */
    type IS_LOADING = true;

    /**
     * 処理エラーあり
     */
    type HAS_ERROR = true;

    /**
     * 更新失敗（処理エラーを含む）
     */
    type IS_FAILURE = true;

    /**
     * fetchingのデフォルト値
     */
    const DEFALUT_FETCHING: fetching = {};

    /**
     * 時・分・秒（小数点以下3桁）
     */
    type hms = {
        hours: any,
        minutes: any,
        seconds: any,
    }

    /**
     * タイム変換
     * @param hms 時・分・秒
     * @returns 秒
     */
    export function hmsToSeconds(hms: hms) {
        return (
            (
                Number(hms.hours) * 60  // 分
                + Number(hms.minutes)
            ) * 60                      // 秒
            + Number(hms.seconds)
        );
    }

    /**
     * タイム変換
     * @param seconds 秒 
     * @returns 時・分・秒
     */
    export function secondsToHms(seconds: number): hms {
        const hours = Math.floor(seconds / (60 * 60));
        const minutes = Math.floor((seconds - hours * 60 * 60) / 60);
        return {
            hours,
            minutes,
            seconds: seconds - ((hours * 60) + minutes) * 60,
        };

    }
}
