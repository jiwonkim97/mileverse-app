import AlertAsync from "react-native-alert-async";
import Axios from './Axios'
import { Alert } from 'react-native';


export async function checkAbusing(_id) {
    const {data} = await Axios.get("/api/notice/abusing-alarm",{params:{id:_id}});
    if(data.abusing) {
        await AlertAsync(data.TITLE,data.EXPL,[
            {
                text:"다시보지않기",
                onPress:async()=>{
                    await Axios.put("/api/notice/abusing-alarm",{id:_id});
                }
            },
            {
                text:"확인"
            }
        ])
    } 
}