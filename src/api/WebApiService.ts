import WebApiData from '../dao/WebApiData';
import CanoeSlalomHeatService from './CanoeSlalomHeatService';

namespace WebApiService {
    export interface PostParameter {
        operationId: string;
        operationData: any;
    }
    
    export function getHeatsAll(operationData: any) {
        const heats: WebApiData.Heat[] = [];
        const names = CanoeSlalomHeatService.getSheetNameList();
        names.forEach(name => {
            heats.push({ name });
        });
        const r: WebApiData.HeatsResponse = {
            type: 'heats',
            heats,
        }
        return r;
    }

}

export default WebApiService;