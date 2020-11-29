
import React,{useEffect} from 'react';
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
import BranchScreen from './src/screen/Branch';
import BarcodeScreen from './src/screen/Barcode';
import NoticeScreen from './src/screen/Notice';
import FaqScreen from './src/screen/FAQ';
import ContactScreen from './src/screen/Contact';
import SignUp02 from './src/screen/SignUp02';
import ChangeScreen from './src/screen/Change';
import GifticonCategory from './src/screen/GifticonCategory';
import GifticonList from './src/screen/GifticonList';
import GifticonDetail from './src/screen/GifticonDetail';
import SignUp01 from './src/screen/SignUp01';
import MileVerseScreen from './src/changeScreen/MileVerse';
import MileVerseGiftScreen from './src/gifticon/MileVerse';
import SplashScreen from 'react-native-splash-screen';
import NiceCheck from './src/screen/NiceCheck';
import DanalPg from './src/screen/DanalPg';
import Profile from './src/screen/Profile';
import ChangePassword from './src/screen/ChangePassword';
import WithDraw from './src/screen/WithDraw';
import Config from './src/screen/Config';
import FindAccount from './src/screen/FindAccount';

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
					fontFamily:"NanumSquareR",
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
			<Tab.Screen name="Change" component={ChangeScreen} options={{title:"교환",tabBarIcon:({focused})=>{
				return (
					<Image source={focused ? require('./assets/img/mvp_active.png') : require('./assets/img/mvp.png')} style={styles.dockIcon}/>
				)
			}}} listeners={()=>({tabPress:event=>LoginGuard(event,navigation,stat,"Change")})}/>
			<Tab.Screen name="Branch" component={BranchScreen} options={{title:"가맹점",tabBarIcon:({focused})=>{
				return (
					<Image source={focused ? require('./assets/img/branch_active.png') : require('./assets/img/branch.png')} style={styles.dockIcon}/>
				)
			}}} listeners={()=>(
				{tabPress:event=>{
				  event.preventDefault();
				}}
			)}/>
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
						<Stack.Screen name="Pay" component={BarcodeScreen} />
						<Stack.Screen name="MyMvp" component={MymvpScreen} />
						<Stack.Screen name="FAQ" component={FaqScreen} />
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Notice" component={NoticeScreen} />
						<Stack.Screen name="Contact" component={ContactScreen} />
						<Stack.Screen name="SignUp02" component={SignUp02} />
						<Stack.Screen name="MileVerse" component={MileVerseScreen} />
						<Stack.Screen name="MileVerseGiftScreen" component={MileVerseGiftScreen} />
						<Stack.Screen name="Profile" component={Profile} />
						<Stack.Screen name="Config" component={Config} />
						<Stack.Screen name="ChangePassword" component={ChangePassword} />
						<Stack.Screen name="WithDraw" component={WithDraw} />
						<Stack.Screen name="GifticonCategory" component={GifticonCategory} />
						<Stack.Screen name="GifticonList" component={GifticonList} />
						<Stack.Screen name="GifticonDetail" component={GifticonDetail} />
						<Stack.Screen name="FindAccount" component={FindAccount} />
						<Stack.Screen name="SignUp01" component={SignUp01} />
						<Stack.Screen name="NiceCheck" component={NiceCheck} />
						<Stack.Screen name="DanalPg" component={DanalPg} />
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