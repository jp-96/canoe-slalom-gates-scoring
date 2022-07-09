import React, { createContext, useContext, useState, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();
import CanoeSlalomHeatService from '../../api/CanoeSlalomHeatService';
import CanoeSlalomHeatData from '../../dao/CanoeSlalomHeatData';

// ToDo: immer
// https://immerjs.github.io/immer/example-setstate#useimmerreducer

type action = actionDatasetLoaded | actionDataChanged | actionDataUpdated;

type actionDatasetLoaded = {
    type: actionTypeLoaded;
    payload: CanoeSlalomHeatData.Dataset;
};

const ACTION_TYPE_LOADED = 'loaded';
type actionTypeLoaded = 'loaded';

type actionDataChanged = {
    type: actionTypeChanged;
    payload: CanoeSlalomHeatData.Data;
}

const ACTION_TYPE_CHANGED = 'changed';
type actionTypeChanged = 'changed';

type actionDataUpdated = {
    type: actionTypeUpdated;
    payload: CanoeSlalomHeatData.Data;
}

const ACTION_TYPE_UPDATED = 'updated';
type actionTypeUpdated = 'updated';

function reducer(draft: CanoeSlalomHeatData.Dataset, action: action) {
    switch (action.type) {
        case ACTION_TYPE_LOADED:
            // データセットの取得完了
            // draftへ全てコピー
            draft.sheetName = action.payload.sheetName;
            draft.runs = action.payload.runs;
            break;
        case ACTION_TYPE_CHANGED:
            // 変更

            // サーバーへ反映

            break;
        case ACTION_TYPE_UPDATED:
            // サーバー反映処理完了（エラーを含む）
            // 更新
            break;
        default:
            break;
    }
}

type CanoeSlalomHeatDataContextType = {
    dataset: CanoeSlalomHeatData.Dataset;
    loading: boolean;
    error?: any;
};

const initialDataset: CanoeSlalomHeatData.Dataset = {
    sheetName: '',
    runs: [],
};

const defaultValue: CanoeSlalomHeatDataContextType = {
    dataset: initialDataset,
    loading: false,
}

const CanoeSlalomHeatDataContext = createContext(defaultValue);

export const useData = () => useContext(CanoeSlalomHeatDataContext);

const useDataset = (criteria: CanoeSlalomHeatService.Criteria): CanoeSlalomHeatDataContextType => {
    // データセットのreducer
    const [dataset, dispatch] = useImmerReducer(reducer, initialDataset);

    // 初回データセット取得処理
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        serverFunctions.getDataset(criteria)
            .then(dataset => dispatch({ type: 'loaded', payload: dataset, }))
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return {
        dataset, loading, error,
    }
}

export default function CanoeSlalomHeatDataProvider({ children }) {
    const criteria: CanoeSlalomHeatService.Criteria = {
        sheetName: 'テストデータ２',
        gates: {
            beginGate: 1,
            gateLength: 5,
        },
    }
    const providerValue = useDataset(criteria)
    return (
        <CanoeSlalomHeatDataContext.Provider value={providerValue}>
            {children}
        </CanoeSlalomHeatDataContext.Provider>
    );
}
