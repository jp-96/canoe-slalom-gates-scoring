export default CanoeSlalomHeatData;
namespace CanoeSlalomHeatData {

    /**
     * 判定 - 未
     */
    export const JUDGE_NONE = ''
    type judgeNone = ''

    /**
     * 判定 - 棄権 (スタートタイム) 
     */
    export const JUDGE_DNS = 'DNS'
    type judgeDns = 'DNS'

    /**
     * 判定 - スタート済 (スタートタイム) 
     */
    export const JUDGE_STARTED = 'STARTED'
    type judgeStarted = 'STARTED'

    /**
     * 判定 - 途中棄権 (ゴールタイム) 
     */
    export const JUDGE_DNF = 'DNF'
    type judgeDnf = 'DNF'

    /**
     * 判定 - ゴール済 (ゴールタイム) 
     */
    export const JUDGE_FINISHED = 'FINISHED'
    type judgeFinished = 'FINIDHED'

    /**
     * 判定 - ペナルティ0（ゲート判定）
     */
    export const JUDGE_P0 = '0'
    type judgeP0 = '0'

    /**
     * 判定 - ペナルティ2（ゲート判定）
     */
    export const JUDGE_P2 = '2'
    type judgeP2 = '2'

    /**
     * 判定 - ペナルティ50（ゲート判定）
     */
    export const JUDGE_P50 = '50'
    type judgeP50 = '50'

    /**
     * 判定 - 失格（スタートタイム/ゲート判定/ゴールタイム）
     */
    export const JUDGE_DSQ = 'DSQ'
    type judgeDsq = 'DSQ'

    /**
     * 選手・タイム・ペナルティのデータセット
     */
    export type Dataset = {
        /**
         * スプレッドシートのシート名
         */
        sheetName: string;
        /**
         * 選手・タイム・ペナルティのレコードセット(要素数:1以上)
         */
        runners: runner[];
    }

    /**
     * 選手のタイムとペナルティのレコード
     */
    export type runner = {
        /**
         * [PK] シートの行番号
         */
        row: number;
        /**
         * ゼッケン番号
         */
        bib: string;
        /**
         * レース名
         */
        heat: string;
        /**
         * スタートタイム
         */
        started?: startedTime;
        /**
         * ゴールタイム
         */
        finished?: finishedTime;
        /**
         * ゲート判定(要素数:1以上)
         */
        gates?: gate[];
    }

    /**
     * スタートタイム
     */
    type startedTime = {
        /**
         * スタートタイム判定
         */
        judge: judgeNone | judgeDns | judgeStarted | judgeDsq;
    } & time

    /**
     * ゴールタイム
     */
    type finishedTime = {
        /**
         * ゴールタイム判定
         */
        judge: judgeNone | judgeDnf | judgeFinished | judgeDsq;
    } & time

    /**
     * スタートタイム・ゴールタイム
     */
    type time = {
        /**
         * 秒(小数点以下3桁まで)
         */
        seconds: number;
    } & system

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

    /**
     * ゲート判定
     */
    export type gate = system & {
        /**
         * <<PK>> ゲート番号(1～30)
         */
        num: number;
        /**
         * ゲート判定
         */
        judge: judgeNone | judgeP0 | judgeP2 | judgeP50 | judgeDsq;
    };

    /**
     * システムメンバー
     */
    export type system = {
        /**
         * データロック済みフラグ
         */
        isLocked?: LOCKED;
        /**
         * データ反映状況(何もなければ、成功)
         */
        fetching: fetching;
    }

    /**
     * データロック済み状態
     */
    type LOCKED = true;

    /**
     * データ反映状況(何もなければ、成功)
     */
    type fetching = {
        /**
         * データ通信中
         */
        isLoading?: IS_LOADING;
        /**
         * 処理エラーあり
         * （更新失敗も同時にtrueとなる）
         */
        hasError?: HAS_ERROR;
        /**
         * 更新失敗
         */
        isFailure?: IS_FAILURE;
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

}
