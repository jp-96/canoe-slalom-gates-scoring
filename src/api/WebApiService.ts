import WebApiData from '../dao/WebApiData';
import CanoeSlalomHeatService from './CanoeSlalomHeatService';

namespace WebApiService {

    export function getHeatsAll() {
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