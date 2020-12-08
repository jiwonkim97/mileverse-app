import React,{useEffect, useState,useCallback} from 'react';
import {View,TouchableWithoutFeedback,StyleSheet,TextInput,Button} from 'react-native';
import Slider from 'rn-range-slider';
import {BoldText} from '../customComponents';
import OriginAxios from 'axios';

const ethRatio = 0.000000001;
const styles = StyleSheet.create({
    configBtn:{
        height:38,
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    input:{
        padding:0,
        fontFamily:"NotoSans-Regular",
        width:250,
        maxWidth:250
    },
    thumb:{
        width:20,height:20,borderRadius:12,backgroundColor:"#FFFFFF"
    },
    shadow:{
        elevation:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        backgroundColor:"white"
    },
    rail:{
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#DCC3D9'
    },
    railSelected:{
        height: 4,
        backgroundColor: '#8D3981',
        borderRadius: 2
    }
})

const Thumb = ()=>(
    <View style={[styles.thumb,styles.shadow]} />
)
const Rail = ()=>(
    <View style={styles.rail} />
)
const RailSelected = ()=>(
    <View style={styles.railSelected} />
)
export default (props)=>{
    const [mode,setMode] = useState("auto");
    const [autoBtn,setAutoBtn] = useState({bg:"#8D3981",textColor:"#FFFFFF"});
    const [manualBtn,setsManualBtn] = useState({bg:"#EBEBEB",textColor:"#C4C4C4"});
    
    // 자동설정 (Slider)
    const [sliderMax,setSliderMax] = useState(100);
    const [sliderMin,setSliderMin] = useState(0);
    const [sliderValue,setSliderValue] = useState(0);
    const [sliderTotalGasFee,setSliderTotalGasFee] = useState(0);
    const [autoGasLimit,setAutoGasLimit] = useState(21000);

    // 직접설정 (Input)
    const [inputTotalGasFee,setInputTotalGasFee] = useState(0);
    const [inputValue,setInputValue] = useState(0);
    const [manGasLimit,setManGasLimit] = useState(21000);


    const renderThumb = useCallback(() => <Thumb/>, []);
    const renderRail = useCallback(() => <Rail/>, []);
    const renderRailSelected = useCallback(() => <RailSelected/>, []);

    const handleValueChange = (low,high,fromUser) => {
        if(fromUser) {
            setSliderValue(low)
        }
        setInputValue(low)
        setSliderTotalGasFee((Number(autoGasLimit)*low*ethRatio).toFixed(12));
        setInputTotalGasFee((Number(manGasLimit)*low*ethRatio).toFixed(12));
    };

    useEffect(()=>{
        if(mode === "auto") {
            props.toGasFee({total:sliderTotalGasFee,limit:autoGasLimit,price:sliderValue});
        } else {
            props.toGasFee({total:inputTotalGasFee,limit:manGasLimit,price:inputValue});
        }
    },[sliderTotalGasFee,inputTotalGasFee,mode])

    useEffect(()=>{
        const _manGasTotal = (Number(manGasLimit)*Number(inputValue)*ethRatio).toFixed(12);
        setInputTotalGasFee(_manGasTotal);
    },[manGasLimit,inputValue])

    useEffect(()=>{
        const setData = async()=>{
            const {data} = await OriginAxios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=DD6IUTZ337M2N4ZBJBUGBT6DDHAK7HMIRS");
            const max = Number(data.result.FastGasPrice);
            const min = Number(data.result.SafeGasPrice);
            const _gasTotal = Number(autoGasLimit) * ((max+min)/2) * ethRatio;
            setSliderMin(min);
            setSliderMax(max);
            setSliderValue(data.result.ProposeGasPrice);
            setSliderTotalGasFee(_gasTotal);
            if(props.symbol !== "ETH") {
                setAutoGasLimit(46000);
                setManGasLimit(46000);
            }
        }
        setData();
    },[])

    const onChangeMode = (_mode)=>{
        if(_mode === "auto") {
            setAutoBtn({bg:"#8D3981",textColor:"#FFFFFF"})
            setsManualBtn({bg:"#EBEBEB",textColor:"#C4C4C4"})
        } else{
            setAutoBtn({bg:"#EBEBEB",textColor:"#C4C4C4"})
            setsManualBtn({bg:"#8D3981",textColor:"#FFFFFF"})
        }
        setMode(_mode)
    }

    return (
        <View>
            <BoldText text={"가스 수수료"}/> 
            <View style={{marginTop:16,flexDirection:"row"}}>
                <TouchableWithoutFeedback onPress={()=>onChangeMode("auto")}>
                    <View style={[styles.configBtn,{borderTopLeftRadius:6,borderBottomLeftRadius:6,backgroundColor:autoBtn.bg}]}>
                        <BoldText text={"자동설정"} customStyle={{color:autoBtn.textColor}}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>onChangeMode("manual")}>
                    <View style={[styles.configBtn,{borderTopRightRadius:6,borderBottomRightRadius:6,backgroundColor:manualBtn.bg}]}>
                        <BoldText text={"직접설정"} customStyle={{color:manualBtn.textColor}}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {
                mode === "auto" ?
                    <View style={{marginTop:30}}>
                            <Slider
                                style={{marginRight:-10,marginLeft:-10}}
                                min={sliderMin}
                                max={sliderMax}
                                low={Number(sliderValue)}
                                step={1}
                                disableRange={true}
                                floatingLabel={false}
                                renderThumb={renderThumb}                            
                                renderRail={renderRail}
                                renderRailSelected={renderRailSelected}
                                onValueChanged={handleValueChange}
                            />
                        <View style={{marginTop:13,flexDirection:'row',justifyContent:"space-between"}}>
                            <BoldText text={"느리게"} customStyle={{color:'#707070',fontSize:10}}/>
                            <BoldText text={`수수료: ${sliderTotalGasFee} ETH`} customStyle={{color:'#707070',fontSize:10}}/>
                            <BoldText text={"빠르게"} customStyle={{color:'#707070',fontSize:10}}/>
                        </View>
                    </View>
                :
                    <View style={{marginTop:16}}>
                        <View style={{borderRadius:6,borderWidth:1,borderColor:"#E5E5E5",flexDirection:"row",height:46,paddingHorizontal:16,alignItems:'center',justifyContent:"space-between"}}>
                            <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"가스 가격을 입력해주세요"} style={styles.input} keyboardType="numeric" value={String(inputValue)} onChangeText={text=>setInputValue(String(text))}/>
                            <BoldText text={"Gwei"}/>
                        </View>
                        <View style={{borderRadius:6,borderWidth:1,borderColor:"#E5E5E5",flexDirection:"row",height:46,paddingHorizontal:16,alignItems:'center',justifyContent:"space-between",marginTop:10}}>
                            <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"가스 리밋을 입력해주세요"} style={styles.input} keyboardType="numeric" value={String(manGasLimit)} onChangeText={text=>setManGasLimit(String(text))}/>
                            <BoldText text={"gas"}/>
                        </View>
                        <View style={{marginTop:10}}>
                            <BoldText text={`수수료: ${String(inputTotalGasFee)} ETH`} customStyle={{color:'#707070',fontSize:10}}/>
                        </View>
                    </View>
            }
            <View style={{marginTop:40,borderWidth:1,borderColor:"#F2F2F2"}} />
            <View style={{marginTop:44,marginBottom:100}}>
                <BoldText text={"[유의사항]"} customStyle={styles.noticeText}/>
                <BoldText text={"잘못 전송한 경우 취소가 불가능합니다.\n전송 시 이더리움 가스비가 발생합니다.\n전송 시 전송 수수료가 발생합니다.\n퍼센티지 버튼은 수수료를 제외한 수량으로 입력됩니다."} customStyle={[styles.noticeText,{marginTop:9,lineHeight:18}]}/>
            </View>
        </View>
    )
}