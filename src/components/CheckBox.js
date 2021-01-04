import React,{useState} from 'react';
import {View,Image,TouchableWithoutFeedback} from 'react-native';
import {BoldText} from "./customComponents";

const CheckBox = (props)=>{
    const [active,setActive] = useState(true);
    

    return (
        <TouchableWithoutFeedback onPress={()=>setActive(!active)}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                {
                    active?
                        <Image source={require('../../assets/img/check_active.png')} style={{width:18,height:18}}/>
                        :
                        <Image source={require('../../assets/img/check_inactive.png')}style={{width:18,height:18}} />
                }
                <BoldText text={props.label} customStyle={{fontSize:12,marginLeft:12,color:"#707070"}}/>
            </View>
            
        </TouchableWithoutFeedback>
    )
}

export default CheckBox;