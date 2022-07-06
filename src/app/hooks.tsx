import { useEffect, useState } from "react";
import Sheetdata from '../api/penaltydata';
import { GASClient } from 'gas-client';
const { serverFunctions } = new GASClient();

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
