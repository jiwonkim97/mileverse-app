import React,{useState} from 'react';
import {View,TextInput,StyleSheet,TouchableWithoutFeedback} from 'react-native';
import { BoldText } from '../../../components/customComponents';
import BooknLifePointComponent from "./BooknLifePointComponent"
import Axios from '../../../modules/Axios';

export default(props)=>{
    const [bookId,setBookId] = useState("");
    const [bookPw,setBookPw] = useState("");
    const [errorTxt,setErrorTxt] = useState("");
    const [isLogin,setIsLogin] = useState(false);
    const [balance,setBalance] = useState(0);

    const handleLoginBtn = async()=>{
        setErrorTxt("")
        if(bookId === "") {
            setErrorTxt("* 아이디를 입력해주세요.")
        } else if(bookPw === "") {
            setErrorTxt("* 비밀번호를 입력해주세요")
        }else {
            const {data} = await Axios.post("/api/booknlifeRouter/users",{id:bookId,pw:bookPw});
            if(data.success === true) {
                props.loginHandler({id:bookId,pw:bookPw});
                props.balanceHandler(data.balance);
                setBalance(data.balance);
                setIsLogin(true);
            } else {
                setErrorTxt(data.message)
            }
        }
    }

    return (
        <>
            {
                isLogin?
                <BooknLifePointComponent balance={balance} {...props} />
                :
                <View style={{paddingTop:30}}>
                    <View style={styles.inputBox}>
                        <TextInput placeholder={"북앤라이프 ID"}
                            placeholderTextColor={"#D5C2D3"}
                            style={styles.input}
                            onChangeText={value=>setBookId(value)}
                        />
                    </View>
                    <View style={[styles.inputBox,{marginTop:10}]}>
                        <TextInput placeholder={"북앤라이프 비밀번호"}
                            placeholderTextColor={"#D5C2D3"}
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={value=>setBookPw(value)}
                        />
                    </View>
                {
                    errorTxt !== "" ?
                    <View style={{marginTop:8}}>
                        <BoldText text={errorTxt} customStyle={{color:"#EE1818",fontSize:10}}/>
                    </View>
                    :
                    null
                }
                
                    <TouchableWithoutFeedback onPress={handleLoginBtn}>
                        <View style={[styles.inputBox,{marginTop:10,justifyContent:"center",alignItems:"center",borderColor:"#8D3981"}]}>
                            <BoldText text={"로그인"} customStyle={{color:"#8D3981"}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    inputBox:{
        borderColor:"#E5E5E5",
        borderWidth:1,
        borderRadius:6,
        height:46
    },
    input:{
        fontFamily:"NotoSans-Regular",
        height:46,
        paddingHorizontal:16
    }
})