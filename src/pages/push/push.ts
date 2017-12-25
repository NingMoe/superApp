import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { NativeProvider } from "../../providers/native";
import {PopProvider} from "../../providers/pop";
/**
 * Generated class for the PushPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-push',
  templateUrl: 'push.html',
})
export class PushPage {
    public pubData:object = {
        content:"56565",
        files:"21212121"
    };
    public content; //存放发表的内容
    public images = []; //存放图片url
    public video = "";  //存放视频url
    public hasAdd:boolean = true;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public pop:PopProvider,
      private actionSheetCtrl:ActionSheetController,
      public native:NativeProvider) {
  }

  ionViewDidLoad() {


  }
    //上传文件
    public uploadPics(){
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择图片/视频',
            buttons: [
                {
                    text: '相机',
                    role: 'destructive',
                    handler: () => {
                        this.native.getPictureByCamera().subscribe(res => {
                            this.images.push.apply(res);
                        })
                    }
                },{
                    text: '图库',
                    handler: () => {
                        this.native.getMultiplePicture({destinationType:1}).subscribe(res => {
                            this.images.push.apply(res);
                            console.log(res)
                        })
                    }
                },{
                    text: '取消',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });
        actionSheet.present();
    }
    //上传视频
    public uploadVideo(){
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择视频',
            buttons: [
                {
                    text: '视频',
                    role: 'destructive',
                    handler: () => {
                        this.native.getPictureByCamera({ mediaType:1}).subscribe(res => {
                            this.video = res;
                        })
                    }
                },{
                    text: '取消',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });
        actionSheet.present();
    }
//发表圈子
    public  pushCircle(){
        console.log(this.pubData)
    }
}
