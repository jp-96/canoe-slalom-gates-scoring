import { useEffect, useState } from "react";
import Sheetdata from '../api/penaltydata';
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

interface inputProps {
  value: any;
  onChange: (e: any) => void;
};

export const useInput = (initialValue): [inputProps, () => void] => {
  const [value, setValue] = useState(initialValue);
  return [
    { value, onChange: e => setValue(e.target.value) },
    () => setValue(initialValue)
  ];
};

export const useGetSheetData = (sheetName: string, beginGate: number, gateLength: number): { loading: boolean, error: any, sections: Sheetdata.section[], setSections: React.Dispatch<React.SetStateAction<Sheetdata.section[]>> } => {
  const emptySections: Sheetdata.section[] = [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [sections, setSections] = useState(emptySections);

  useEffect(() => {
    serverFunctions.getData(sheetName, beginGate, gateLength)
      .then(sheetData => setSections(sheetData.sections))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return {
    loading, error, sections, setSections,
  }
}
