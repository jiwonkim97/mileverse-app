
import React,{useEffect,useState} from 'react';
import { useWindowDimensions,Image,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CardStyleInterpolators,createStackNavigator } from '@react-navigation/stack';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useSelector } from 'react-redux';
import rootReducer from './src/reducers';

import thunk from 'redux-thunk';
import Spinner from 'react-native-loading-spinner-overlay';

import CustomDrawerContent from './src/components/Drawer'
import { RootSiblingParent } from 'react-native-root-siblings';
import DialogComponent from './src/components/Dialog';

import HomeScreen from './src/screen/Home';
import LoginScreen from './src/screen/Login';
import MymvpScreen from './src/screen/Mymvp';
import NoticeScreen from './src/screen/Notice';
import FaqScreen from './src/screen/FAQ';
import ContactScreen from './src/screen/Contact';
import SignUp02 from './src/screen/SignUp02';
import ChangeScreen from './src/screen/Change';
import GifticonCategory from './src/screen/GifticonCategory';
import GifticonList from './src/screen/GifticonList';
import GifticonDetail from './src/screen/GifticonDetail';
import SignUp01 from './src/screen/SignUp01';
import SplashScreen from 'react-native-splash-screen';
import NiceCheck from './src/screen/NiceCheck';
import DanalPg from './src/screen/DanalPg';
import Profile from './src/screen/Profile';
import ChangePassword from './src/screen/ChangePassword';
import WithDraw from './src/screen/WithDraw';
import Config from './src/screen/Config';
import FindAccount from './src/screen/FindAccount';
import PinCode from './src/screen/PinCode';
import WalletScreen from './src/screen/Wallet';
import WalletDetail from "./src/screen/WalletDetail";
import WalletDetailOnBtc from "./src/screen/WalletDetailOnBtc";
import WalletReceipt from './src/screen/WalletReceipt';
import WalletDeposit from './src/screen/WalletDeposit';
import WalletWithDraw from './src/screen/WalletWithDraw';
import WalletResult from './src/screen/WalletResult';
import WalletAgree from './src/screen/WalletAgree';
import ScanScreen from './src/screen/ScanScreen';
import HealthPick from './src/screen/changePoint/HealthPick';
import HealthPickResult from './src/screen/changePoint/HealthPickResult';
import SwapResult from './src/screen/swapPoint/SwapResult';
import SwapMain from './src/screen/swapPoint/SwapMain';
import MvpToMvc from './src/screen/swapPoint/MvpToMvc';
import MvcToMvp from './src/screen/swapPoint/MvcToMvp';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const store = createStore(rootReducer, applyMiddleware(thunk));
const LoginGuard = (event,navigation,_stat,_target) =>{
	event.preventDefault();
	_stat === false ? navigation.navigate("Login") : navigation.navigate(_target)
}
const TabScreen = ({navigation}) =>{
	const stat = useSelector(state => state.authentication.status.isLoggedIn);
	const wallet = useSelector(state => state.authentication.userInfo.wallet);
	return (
		<Tab.Navigator
			initialRouteName="Home"
			activeColor="#8d3981"
			inactiveColor="#b8b8b8"
			
			tabBarOptions={{
				activeTintColor: '#8d3981',
				inactiveTintColor: '#b8b8b8',
				tabStyle:{
					justifyContent:"center"
				},
				labelStyle:{
					fontFamily:"NanumSquareB",
					bottom:6
				},
				iconStyle:{
					top:-3
				}
			  }}
			barStyle={{ backgroundColor: 'white' }}
		>
			<Tab.Screen name="Home" component={HomeScreen} options={{title:"홈",tabBarIcon:({focused})=>{
				return (
					<Image source={focused ? require('./assets/img/home_active.png') : require('./assets/img/home.png')} style={styles.dockIcon}/>
				)
			}}}/>
			<Tab.Screen name="GifticonCategory" component={GifticonCategory} options={{title:"사용처",tabBarIcon:({focused})=>{
				return (
					<Image source={focused ? require('./assets/img/branch_active.png') : require('./assets/img/branch.png')} style={styles.dockIcon}/>
				)
			}}} listeners={()=>(
				{tabPress:event=>{
					LoginGuard(event,navigation,stat,"GifticonCategory")
				}}
			)}/>
			<Tab.Screen name="Change" component={ChangeScreen} options={{title:"교환",tabBarIcon:({focused})=>{
				return (
					<Image source={focused ? require('./assets/img/mvp_active.png') : require('./assets/img/mvp.png')} style={styles.dockIcon}/>
				)
			}}} listeners={()=>({tabPress:event=>LoginGuard(event,navigation,stat,"Change")})}/>
			<Tab.Screen name="Wallet" component={WalletScreen} options={{title:"내 지갑",tabBarIcon:({focused})=>{
				return (
					<Image source={focused ? require('./assets/img/wallet_active.png') : require('./assets/img/wallet.png')} style={styles.dockIcon}/>
				)
			}}} listeners={()=>({tabPress:event=>{
				event.preventDefault();
				if(stat && wallet === "true") {
					navigation.navigate("Wallet")
				} else if(stat){
					navigation.navigate("WalletAgree")
				} else {
					navigation.navigate("Login")
				}
			}})}/>
			<Tab.Screen name="Menu" component={HomeScreen} options={{title:"메뉴",tabBarIcon:({focused})=>{
				return (
					<Image source={focused ? require('./assets/img/menu_active.png') : require('./assets/img/menu.png')} style={styles.dockIcon}/>
				)
			}}}
				listeners={()=>(
					{tabPress:event=>{
					  event.preventDefault();
					  navigation.openDrawer()
					}}
				)}
			/>
		</Tab.Navigator>
	)
}
const DrawerScreen = ({navigation}) =>{
	const dimensions = useWindowDimensions();
	return (
		<Drawer.Navigator
			drawerContent={props=> <CustomDrawerContent {...props} />}
			drawerPosition= "right"
			drawerType={dimensions.width >= 768 ? 'permanent' : 'front'}
		>
			<Drawer.Screen name="menu" component={TabScreen} />
		</Drawer.Navigator>
	)
}
const SpinnerComponent = () =>{
	const spinner = useSelector(state => state.spinner.status);
	return (
		<Spinner
			visible={spinner}
			color="#8D3981"
			animation="fade"
		/>
	)
}
const App = () => {
	useEffect(()=>{
		setTimeout(()=>{
			SplashScreen.hide();
		},2000)
	},[])
	
	return (
		<RootSiblingParent>
			<Provider store={store}>
				<SpinnerComponent />
				<NavigationContainer>
					<Stack.Navigator screenOptions={{headerShown:false,cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}} mode='card'>
						<Stack.Screen name="Drawer"component={DrawerScreen} />
						<Stack.Screen name="MyMvp" component={MymvpScreen} />
						<Stack.Screen name="FAQ" component={FaqScreen} />
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Notice" component={NoticeScreen} />
						<Stack.Screen name="Contact" component={ContactScreen} />
						<Stack.Screen name="SignUp02" component={SignUp02} />
						<Stack.Screen name="Profile" component={Profile} />
						<Stack.Screen name="Config" component={Config} />
						<Stack.Screen name="ChangePassword" component={ChangePassword} />
						<Stack.Screen name="WithDraw" component={WithDraw} />
						<Stack.Screen name="GifticonList" component={GifticonList} />
						<Stack.Screen name="GifticonDetail" component={GifticonDetail} />
						<Stack.Screen name="FindAccount" component={FindAccount} />
						<Stack.Screen name="SignUp01" component={SignUp01} />
						<Stack.Screen name="NiceCheck" component={NiceCheck} />
						<Stack.Screen name="DanalPg" component={DanalPg} />
						<Stack.Screen name="PinCode" component={PinCode} />
						<Stack.Screen name="WalletDetail" component={WalletDetail} />
						<Stack.Screen name="WalletDetailOnBtc" component={WalletDetailOnBtc} />
						<Stack.Screen name="WalletReceipt" component={WalletReceipt} />
						<Stack.Screen name="WalletDeposit" component={WalletDeposit} />
						<Stack.Screen name="WalletWithDraw" component={WalletWithDraw} />
						<Stack.Screen name="WalletResult" component={WalletResult} options={{gestureEnabled:false}}/>
						<Stack.Screen name="WalletAgree" component={WalletAgree} />
						<Stack.Screen name="ScanScreen" component={ScanScreen} />
						<Stack.Screen name="JhealthPick" component={HealthPick} />
						<Stack.Screen name="HealthPickResult" component={HealthPickResult} options={{gestureEnabled:false}}/>
						<Stack.Screen name="MvcToMvp" component={MvcToMvp}/>
						<Stack.Screen name="MvpToMvc" component={MvpToMvc}/>
						<Stack.Screen name="SwapResult" component={SwapResult}/>
						<Stack.Screen name="SwapMain" component={SwapMain}/>
					</Stack.Navigator>
				</NavigationContainer>
				<DialogComponent />
			</Provider>
		</RootSiblingParent>
	);
};

export default App;


const styles = StyleSheet.create({
    dockIcon:{width:24,height:24,resizeMode:"contain"}
});