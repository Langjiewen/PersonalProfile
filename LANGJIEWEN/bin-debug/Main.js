//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.createGameScene = function () {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.scrollRect = new egret.Rectangle(0, 0, this.stageW, this.stageH * 2);
        this.touchEnabled = true;
        this.starttouchPosY = 0;
        this.currentPageY = 0;
        this.moveDistance = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startScroll, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.stopScroll, this);
        var page01 = new egret.DisplayObjectContainer;
        this.addChild(page01);
        page01.width = this.stageW;
        page01.height = this.stageH;
        page01.touchEnabled = true;
        var sky01 = this.createBitmapByName("page01_jpg");
        page01.addChild(sky01);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky01.width = stageW;
        sky01.height = stageH;
        var topMask01 = new egret.Shape();
        topMask01.graphics.beginFill(0x000000, 0.5);
        topMask01.graphics.drawRect(0, 0, stageW, 172);
        topMask01.graphics.endFill();
        topMask01.y = 33;
        page01.addChild(topMask01);
        topMask01.addEventListener(egret.TouchEvent.TOUCH_MOVE, function () {
            egret.Tween.get(topMask01, { loop: true }).to({ alpha: 0 }, 1, egret.Ease.circIn).to({ alpha: 0.5 }, 2000, egret.Ease.circIn);
        }, this);
        var icon = this.createBitmapByName("hello_jpg");
        page01.addChild(icon);
        icon.x = 26;
        icon.y = 60;
        icon.touchEnabled = true;
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        page01.addChild(line);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "My Personal Resunme";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        page01.addChild(colorLabel);
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        var page02 = new egret.DisplayObjectContainer;
        page02.y = this.stageH;
        this.addChild(page02);
        page02.width = this.stageW;
        page02.height = this.stageH;
        page02.touchEnabled = true;
        var sky02 = this.createBitmapByName("page02_jpg");
        page02.addChild(sky02);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky02.width = stageW;
        sky02.height = stageH;
        var topMask02 = new egret.Shape();
        topMask02.graphics.beginFill(0x000000, 0.5);
        topMask02.graphics.drawRect(0, 0, stageW, 172);
        topMask02.graphics.endFill();
        topMask02.y = 33;
        page02.addChild(topMask02);
        topMask02.addEventListener(egret.TouchEvent.TOUCH_MOVE, function () {
            egret.Tween.get(topMask02, { loop: true }).to({ alpha: 0 }, 1, egret.Ease.circIn).to({ alpha: 0.5 }, 2000, egret.Ease.circIn);
        }, this);
        var colorLabel02 = new egret.TextField();
        colorLabel02.textColor = 0xffffff;
        colorLabel02.width = stageW - 172;
        colorLabel02.textAlign = "center";
        colorLabel02.text = "Intoduce";
        colorLabel02.size = 60;
        colorLabel02.x = 100;
        colorLabel02.y = 85;
        page02.addChild(colorLabel02);
        var text = new egret.TextField();
        text.textColor = 0x777674;
        text.width = stageW - 172;
        text.bold = true;
        text.text = "姓名：郎洁文\n\n性别：女\n\n生日：1996.11.4\n\n本科：北京工业大学\n\n专业：数字媒体技术\n\n爱好：看书，看电视剧，看电影，\n\n           到处逛逛吃吃走走~";
        text.bold = true;
        text.size = 30;
        text.x = 100;
        text.y = 240;
        page02.addChild(text);
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    //第一次接触屏幕时
    p.startScroll = function (e) {
        if ((this.scrollRect.y % this.stageH) != 0) {
            this.scrollRect.y = this.currentPageY;
        }
        this.starttouchPosY = e.stageY;
        this.currentPageY = this.scrollRect.y;
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onScroll, this);
    };
    //连续触摸时调用，计算出每时每刻移动的距离，并控制屏幕滑动
    p.onScroll = function (e) {
        var rect = this.scrollRect;
        this.moveDistance = this.starttouchPosY - e.stageY;
        rect.y = this.currentPageY + this.moveDistance;
        this.scrollRect = rect;
    };
    p.stopScroll = function (e) {
        var rect = this.scrollRect;
        if ((this.moveDistance >= (this.stage.stageHeight / 3)) && this.currentPageY != this.stageH) {
            rect.y = this.currentPageY + this.stageH;
            this.scrollRect = rect;
            this.moveDistance = 0;
        }
        else if ((this.moveDistance <= (-(this.stage.stageHeight / 3))) && this.currentPageY != 0) {
            rect.y = this.currentPageY - this.stageH;
            this.scrollRect = rect;
            this.moveDistance = 0;
        }
        else {
            this.moveDistance = 0;
            rect.y = this.currentPageY;
            this.scrollRect = rect;
        }
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onScroll, this);
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
