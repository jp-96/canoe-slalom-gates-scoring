import React, { createContext, useContext, useState, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();
import CanoeSlalomHeatService from '../../api/CanoeSlalomHeatService';
import CanoeSlalomHeatData from '../../dao/CanoeSlalomHeatData';
import AppConfig from '../../api/AppConfig';
import { useData as usePushedData } from './HtmlTemplateDataProvider';

// ToDo: immer
// https://immerjs.github.io/immer/example-setstate#useimmerreducer

type action = actionDatasetLoaded | actionDataChanged | actionDataUpdated;

/**
 * データセット取得完了
 */
const ACTION_TYPE_LOADED = 'loaded';
type actionTypeLoaded = 'loaded';

type actionDatasetLoaded = {
    type: actionTypeLoaded;
    payload: CanoeSlalomHeatData.Dataset;
};

/**
 * 画面データ変更
 */
const ACTION_TYPE_CHANGED = 'changed';
type actionTypeChanged = 'changed';

type actionDataChanged = {
    type: actionTypeChanged;
    payload: CanoeSlalomHeatData.Data;
}

const ACTION_TYPE_UPDATED = 'updated';
type actionTypeUpdated = 'updated';

type actionDataUpdated = {
    type: actionTypeUpdated;
    payload: CanoeSlalomHeatData.Data;
}

function reducer(draft: CanoeSlalomHeatData.Dataset, action: action) {
    switch (action.type) {
        case ACTION_TYPE_LOADED:
            // ロード完了 - データセットの取得完了
            // draftへ全てコピー
            draft.sheetName = action.payload.sheetName;
            draft.runs = action.payload.runs;
            break;
        case ACTION_TYPE_CHANGED:
            // 変更
            const row = action.payload.runner.row;
            const run = draft.runs.find(run => run.runner.row === row);
            if (run) {
                if (action.payload.started) {
                    // スタートタイムの変更

                } else if (action.payload.finished) {
                    // ゴールタイムの変更

                } else if (action.payload.gate) {
                    // ゲート判定の変更
                    if (run.gates) {
                        const num = action.payload.gate.num;
                        const gate = run.gates.find(gate => gate.num === num);
                        if (gate) {
                            gate.judge = action.payload.gate.judge;
                            gate.fetching.isLoading = true;
                        }
                    }
                }
            }
            break;
        case ACTION_TYPE_UPDATED:
            // 更新 - サーバー反映処理完了（エラーを含む）
            break;
        default:
            break;
    }
}

type CanoeSlalomHeatDataContextType = {
    dataset: CanoeSlalomHeatData.Dataset;
    loading: boolean;
    error?: any;
    setStartedTime: (row: number, seconds: number, judge: any) => void;
    setFinishedTime: (row: number, seconds: number, judge: any) => void;
    setGateJudge: (row: number, num: number, judge: any) => void;
};

const initialDataset: CanoeSlalomHeatData.Dataset = {
    sheetName: '',
    runs: [],
};

const defaultValue: CanoeSlalomHeatDataContextType = {
    dataset: initialDataset,
    loading: false,
    setStartedTime: (row, seconds, judge) => undefined,
    setFinishedTime: (row, seconds, judge) => undefined,
    setGateJudge: (row, num, judge) => undefined,
}

const CanoeSlalomHeatDataContext = createContext(defaultValue);

export const useData = () => useContext(CanoeSlalomHeatDataContext);

const useDataset = (criteria: CanoeSlalomHeatService.Criteria): CanoeSlalomHeatDataContextType => {
    // データセットのreducer
    const [dataset, dispatch] = useImmerReducer(reducer, initialDataset);

    const getDataAttrs = (row: number) => {
        const sheetName = dataset.sheetName;
        let bib = '';
        let heat = '';
        const runs = dataset.runs.filter(run => run.runner.row == row);
        if (runs.length > 0) {
            bib = runs[0].runner.bib;
            heat = runs[0].runner.heat;
        }
        return { sheetName, bib, heat, fetching: {}, }
    }

    const setLoaded = (dataset: CanoeSlalomHeatData.Dataset) => {
        dispatch({
            type: ACTION_TYPE_LOADED,
            payload: dataset,
        });
    };
    const setChanged = (data: CanoeSlalomHeatData.Data) => {
        dispatch({
            type: ACTION_TYPE_CHANGED,
            payload: data,
        });
    }
    const setUpdated = (data: CanoeSlalomHeatData.Data) => {
        dispatch({
            type: ACTION_TYPE_UPDATED,
            payload: data,
        });
    }

    // 初回データセット取得処理
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        serverFunctions.getDataset(criteria)
            .then(setLoaded)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const setStartedTime = (row: number, seconds: number, judge: any) => {
        const { sheetName, bib, heat, fetching } = getDataAttrs(row);
        const data: CanoeSlalomHeatData.Data = {
            sheetName,
            runner: {
                row,
                bib,
                heat,
            },
            started: {
                seconds,
                judge,
                fetching,
            }
        }
        setChanged(data);
    }

    const setFinishedTime = (row: number, seconds: number, judge: any) => {
        const { sheetName, bib, heat, fetching } = getDataAttrs(row);
        const data: CanoeSlalomHeatData.Data = {
            sheetName,
            runner: {
                row,
                bib,
                heat,
            },
            finished: {
                seconds,
                judge,
                fetching,
            }
        }
        setChanged(data);
    }

    const setGateJudge = (row: number, num: number, judge: any) => {
        const { sheetName, bib, heat, fetching } = getDataAttrs(row);
        const data: CanoeSlalomHeatData.Data = {
            sheetName,
            runner: {
                row,
                bib,
                heat,
            },
            gate: {
                num,
                judge,
                fetching,
            }
        }
        setChanged(data);
    }

    return {
        dataset, loading, error, setStartedTime, setFinishedTime, setGateJudge
    }
}

export default function CanoeSlalomHeatDataProvider({ children }) {
    const { data } = usePushedData<AppConfig.AppConfig>();
    const criteria: CanoeSlalomHeatService.Criteria = {
        sheetName: data.sheetName,
        gates: {
            beginGate: data.beginGate,
            gateLength: data.gateLength,
        },
    }
    const providerValue = useDataset(criteria)
    return (
        <CanoeSlalomHeatDataContext.Provider value={providerValue}>
            {children}
        </CanoeSlalomHeatDataContext.Provider>
    );
}
