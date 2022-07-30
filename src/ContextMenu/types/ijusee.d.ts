/*
 * @Description: 接口
 * @Author: Jin（https://github.com/ElevenIjusee?tab=repositories）
 * @Date: 2022-04-27 13:30:05
 * @LastEditors: Jin
 * @LastEditTime: 2022-04-27 22:14:58
 */
declare interface I_list {
    text?: string,
    icon?: string,
    sub?: Array<I_list>,
    enabled?: boolean,
    events?: {
        click: Function,
    },
    type?: any,
}
declare interface I_catCesium {
    // init(menu: Menu): void;                                //初始化
    getLocalPos(): void;                                   //获取鼠标位置坐标
    getCameraInfo(): void;                                 //获取相机信息
    moveToRightClick(): void;                              //移动到鼠标位置
    standRightClick(): void;                               //以第一人称视角站立到鼠标位置
    printscreen(): void;                                   //截屏
    openSun(state: boolean): void;                         //开启关闭光照效果
    openSkyAtmosphere(state: boolean): void;               //开启关闭大气效果
    openDepthTestAgainstTerrain(state: boolean): void;     //开启关闭深度检测
    openEarthOpt(state: boolean): void;                    //开启关闭地表透明
    openEarthTriangle(state: boolean): void;               //开启关闭地表三角网
    arroundFly(): void;                                    //开始环绕鼠标位置飞行
    stopArround(): void;                                   //退出环绕飞行
    openNightVision(state: boolean): void                  //开启关闭夜视效果
    openBlackAndWhite(state: boolean): void                //开启关闭黑白特效
    openMosaic(state: boolean): void;                      //开启关闭马赛克特效
    openDepthOfField(state: boolean): void;                //开启关闭景深特效
    openBloom(state: boolean): void;                       //开启关闭辉光特效
    // transformCnToCc(cartesianPosition: Cartesian3): Array<number>;  //转换函数
}

declare interface T_e {
    clientX: number,
    clientY: number,
}