import {Component, Input, ViewChild} from '@angular/core';
import {Platform, Nav, IonicApp, Keyboard, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {PopProvider} from "../providers/pop";
import {HttpProvider} from "../providers/http";
import {AuthProvider} from "../providers/auth";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = "TabsPage";
    public codeStatus = false;
    public backButtonPressed = false;
    @Input() codeData: Object = {};
    @ViewChild(Nav) nav: Nav;
    public loginStatus: boolean = false;

    constructor(public ionicApp: IonicApp,
                public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                public Pop: PopProvider,
                public Auth:AuthProvider,
                public events: Events,
                public Http:HttpProvider,
                public keyboard: Keyboard) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            this.listenLogin();
            //订阅登录状态信息
            this.events.subscribe("loginStatus", (status) => {
                this.loginStatus = status;
            });
            this.registerBackButtonAction();
        });
    }

    // 注册双击硬件返回按钮退出应用事件
    public registerBackButtonAction() {
        this.platform.registerBackButtonAction(() => {
            if (this.keyboard.isOpen()) {
                this.keyboard.close();
                return;
            }
            //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
            // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
            let activePortal = this.ionicApp._modalPortal.getActive();
            if (activePortal) {
                activePortal.dismiss().catch(() => {
                });
                activePortal.onDidDismiss(() => {
                });
                return;
            }
            let activeVC = this.nav.getActive();
            let tabs = activeVC.instance.tabs;
            let activeNav = tabs.getSelected();
            return activeNav.canGoBack() ? activeNav.pop() : this.showExit()
        }, 1);
    }

    //双击退出提示框
    public showExit() {
        if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
            this.platform.exitApp();
        } else {
            this.Pop.toast("再按一次退出应用");
            this.backButtonPressed = true;
            setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
        }
    }
    // 监听本地是否有token，判断登录状态
    public listenLogin(){
        this.Http.hasToken().subscribe(token => {
            if (token === false) {
                this.loginStatus = false;
            }else{
                this.loginStatus = true;
            }
        })
    }
    // 显示个人名片
    public showQr() {
        this.codeStatus = true
    }

    public fadeOut(event) {
        this.codeStatus = event;
    }
    // 跳转至登录页
    public login() {
        this.Auth.modalNoData("LoginPage");
        // this.nav.push("LoginPage");
    }
    // 跳转至注册页面
    public register() {
        this.Auth.modalNoData("RegisterPage");

        // this.nav.push("RegisterPage");
    }
}
