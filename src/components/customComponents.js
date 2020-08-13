import React from 'react';
import { Text,StyleSheet } from 'react-native';

export function RegularText(props){
    return (
        <Text style={[styles.regular,props.customStyle]}>
            {props.text}
        </Text>
    )
}
export function BoldText(props){
    return (
        <Text style={[styles.bold,props.customStyle]}>
            {props.text}
        </Text>
    )
}

export function ExtraBoldText(props){
    return (
        <Text style={[styles.extrabold,props.customStyle]}>
            {props.text}
        </Text>
    )
}

const styles = StyleSheet.create({
    regular:{
        fontFamily:"NanumSquareR"
    },
    bold:{
        fontFamily:"NanumSquareB"
    },
    extrabold:{
        fontFamily:"NanumSquareEB"
    }
});