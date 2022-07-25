namespace WebApiData {

    export type HeatsResponse = {
        type: 'heats';
        heats: Heat[];
    }

    export type Heat = {
        name: string;
    };

}

export default WebApiData;
