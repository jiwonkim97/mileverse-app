import React,{useState} from 'react';
import {View,StyleSheet,TextInput,FlatList} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BoldText } from '../../../components/customComponents';
import {formmatedNumber} from '../../../modules/CommonHelper';

const ratio = [100,50,25,10];
export default(props)=>{
    const [toPoints,setToPoints] = useState(0);
    const [selectedRatio,setSelectedRatio] = useState("");

    const handleSelectRatio = (item)=>{
        if(selectedRatio === item) {
            setSelectedRatio("");
            setToPoints(0);
            props.changePointsHandler(0)
        } else {
            setSelectedRatio(item);
            const calcPoints = Math.floor(props.balance * (item / 100));
            setToPoints(calcPoints);
            props.changePointsHandler(calcPoints);
        }
    }

    const handlePointsInput = (value)=>{
        props.changePointsHandler(value);
        setToPoints(value);
        setSelectedRatio("");
    }

    const renderRatioBtn = ({item,index})=>{
        let textColor = "#707070";
        let bgColor = "#FFFFFF";
        if(item === selectedRatio) {
            textColor = "#FFFFFF";
            bgColor = "#8D3981"
        }
        return (
            <TouchableWithoutFeedback onPress={()=>handleSelectRatio(item)}>
                <View style={{backgroundColor:bgColor,borderRadius:6,justifyContent:"center",alignItems:"center",width:55,height:36,borderWidth:1,borderColor:"#E5E5E5"}}>
                    <BoldText text={`${item}%`} customStyle={{color:textColor}}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    return (
        <View style={{paddingTop:30,flex:1}}>
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                <BoldText text={"보유 포인트"} />
                <View
                    style={{borderRadius:6,backgroundColor:'#F3F3F3',borderColor:'#E5E5E5',borderWidth:1,paddingHorizontal:16,alignItems:"center",justifyContent:"flex-end",width:250,flexDirection:"row",height:46}}>
                    <BoldText text={formmatedNumber(props.balance)} />
                    <BoldText text={'원'} customStyle={{marginLeft:20}}/>
                </View>
            </View>
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                <BoldText text={"전환 포인트"} />
                <View style={{borderRadius:6,borderColor:'#E5E5E5',borderWidth:1,paddingHorizontal:16,alignItems:"center",justifyContent:"space-between",width:250,flexDirection:"row",height:46}}>
                    <TextInput onChangeText={(text)=>handlePointsInput(text)} value={String(toPoints)} placeholder={"전환 할 포인트를 입력해주세요"} placeholderTextColor="#D5C2D3" keyboardType={"phone-pad"} style={{padding:0,fontFamily:"NotoSans-Regular",textAlign:'right',flex:1}}/>
                    <BoldText text={"원"} customStyle={{marginLeft:20}}/>
                </View>
            </View>
            <View style={{marginTop:10,alignItems:'flex-end'}}>
                <FlatList
                    renderItem={renderRatioBtn}
                    keyExtractor={(item, index) => String(index)}
                    data={ratio}
                    horizontal={true}
                    extraData={selectedRatio}
                    ItemSeparatorComponent={() => <View style={{margin: 5}}/>}
                    inverted
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})