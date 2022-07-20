/* eslint-disable no-undef */

import {
  Viewer,
  defaultValue,
  CustomDataSource,
  ScreenSpaceEventHandler,
  Color,
  HorizontalOrigin,
  defined,
  CallbackProperty,
  HeightReference,
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  LabelStyle,
  VerticalOrigin,
  ScreenSpaceEventType,
  Cartesian2,
  PolygonPipeline,
  PolygonHierarchy,
  destroyObject,
} from "cesium";

/**
 * 绘制（量算）工具
 * @param options
 * @param {Viewer} options.viewer  地球容器
 * @param {Boolean} options.isMeasure  是否开启量算功能
 * @param {Boolean} options.isClampGround  是否开启贴地功能
 * @param {Number} options.lineWidth  线宽
 * @param {Boolean} options.showNode  是否显示绘制节点
 * @param {Boolean} options.pointColor 点颜色
 * @param {Color}options.polylineColor 线颜色
 * @param {Color} options.polygonColor 面颜色
 * @param {Color} options.labelColor 注记颜色
 * @param {HorizontalOrigin} options.labelHorizontalOrigin 注记水平对齐方式
 * @param {String} options.labelFont 注记大小与字体
 * @constructor
 */
export class Measure {
  private _viewer: Viewer;
  private _isMeasure: boolean;
  private _isClampGround: boolean;
  private _lineWidth: number;
  private _showNode: boolean;
  private _layer: CustomDataSource;
  private _handler: ScreenSpaceEventHandler;
  private _pointer: boolean;
  private _pointColor: Color;
  private _polylineColor: Color;
  private _polygonColor: Color;
  private _labelColor: Color;
  private _labelHorizontalOrigin: any;
  private _labelFont: any;
  public drawPoint: boolean;
  public drawPolyline: boolean;
  public drawPolygon: boolean;
  public drawElevation: boolean;
  constructor(options) {
    this._viewer = options.viewer;
    this._isMeasure = defaultValue(options.isMeasure, false);
    this._isClampGround = defaultValue(options.isClampGround, false);
    this._lineWidth = defaultValue(options.lineWidth, 3.0);
    this._showNode = defaultValue(options.showNode, true);

    this._layer = new CustomDataSource("drawing");
    this._viewer.dataSources.add(this._layer);
    this._handler = new ScreenSpaceEventHandler(this._viewer.canvas);
    this._pointer = false;

    this._viewer.scene.globe.depthTestAgainstTerrain = true;

    this._pointColor =
      options.pointColor || Color.fromCssColorString("#00FF00");
    this._polylineColor =
      options.polylineColor || Color.fromCssColorString("#F08519");
    this._polygonColor =
      options.polygonColor || Color.fromBytes(136, 187, 255, 136);
    this._labelColor = options.labelColor || Color.YELLOW;
    this._labelHorizontalOrigin =
      options.labelHorizontalOrigin || HorizontalOrigin.LEFT;
    this._labelFont = options.labelFont || "18px Helvetica";

    this.drawPoint = false;
    this.drawPolyline = false;
    this.drawPolygon = false;
    this.drawElevation = false;
  }
  setIsMeasure(isMeasure) {
    this._isMeasure = isMeasure;
  }
  setIsClampGround(isClampGround) {
    this._isClampGround = isClampGround;
  }
  /**
   * 开始画点
   */
  startPoint() {
    this.drawPoint = true;
    let leftClickHandler = (click) => {
      if (this.drawPoint) {
        // var cartesian = scene.globe.pick(viewer.camera.getPickRay(pick), scene);
        // let position = this._viewer.scene.pickPosition(new Cartesian2(click.position.x, click.position.y));
        let pos = this._viewer.scene.pickPosition(click.position);
        if (!defined(pos)) {
          return;
        }
        if (!this._isMeasure) {
          return this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(() => {
              return Cartesian3.clone(pos);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });
        }
        let cartographic = Cartographic.fromCartesian(pos);
        let longitudeString = CesiumMath.toDegrees(
          cartographic.longitude
        ).toFixed(5);
        let latitudeString = CesiumMath.toDegrees(
          cartographic.latitude
        ).toFixed(5);
        let height =
          cartographic.height > 1000
            ? (cartographic.height / 1000).toFixed(5) + "km"
            : cartographic.height.toFixed(3) + "m ";
        // let that = this;
        this._layer.entities.add({
          name: "drawing",
          position: new CallbackProperty(() => {
            return Cartesian3.clone(pos);
          }, false),
          point: {
            pixelSize: 10,
            color: this._pointColor,
            heightReference: HeightReference.NONE,
          },
          label: {
            text:
              "经度: " +
              ("        " + longitudeString).slice(-12) +
              "\u00B0" +
              "\n纬度: " +
              ("        " + latitudeString).slice(-12) +
              "\u00B0" +
              "\n高度：" +
              ("        " + height).slice(-12) +
              "  ",
            font: this._labelFont,
            fillColor: this._labelColor,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            style: LabelStyle.FILL_AND_OUTLINE,
            showBackground: true,
            horizontalOrigin: this._labelHorizontalOrigin,
            verticalOrigin: VerticalOrigin.BOTTOM,
            heightReference: HeightReference.NONE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });

        // this.stopPoint();
      }
    };
    this._handler.setInputAction(
      leftClickHandler,
      ScreenSpaceEventType.LEFT_CLICK
    );
  }
  /**
   * 停止画点
   */
  stopPoint() {
    this.drawPoint = false;
    this._handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }
  /**
   * 开始画线
   */
  startPolyline() {
    this.stopPoint();
    this.drawPolyline = true;
    const linePositions = [];
    let distance = 0;
    let mouseMoveHandler;
    let leftClickHandler = (click) => {
      if (this.drawPolyline) {
        let surfacePosition = this._viewer.scene.pickPosition(click.position);
        if (!defined(surfacePosition)) {
          // surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.position.x, click.position.y)), this._viewer.scene);
          // if(!defined(surfacePosition)){
          return;
          // }
        }
        linePositions.pop();
        linePositions.push(surfacePosition);
        if (this._showNode) {
          this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(function () {
              return Cartesian3.clone(surfacePosition);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });
        }

        if (this._isMeasure && linePositions.length > 1) {
          distance = this.calcSpaceDistance(linePositions);
        }
        this._pointer = false;

        if (!mouseMoveHandler) {
          mouseMoveHandler = (click) => {
            if (this.drawPolyline && linePositions.length > 0) {
              if (this._pointer) {
                let surfacePosition = this._viewer.scene.pickPosition(
                  click.endPosition
                );
                if (!defined(surfacePosition)) {
                  // surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.endPosition.x, click.endPosition.y)), this._viewer.scene);
                  // if(!defined(surfacePosition)){
                  return;
                  // }
                }
                linePositions.pop();
                // let surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.endPosition.x, click.endPosition.y)), this._viewer.scene);

                linePositions.push(surfacePosition);
                if (this._isMeasure && linePositions.length > 1) {
                  distance = this.calcSpaceDistance(linePositions);
                }
              } else {
                // let surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.endPosition.x, click.endPosition.y)), this._viewer.scene);
                let surfacePosition = this._viewer.scene.pickPosition(
                  click.endPosition
                );
                if (!defined(surfacePosition)) {
                  // surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.endPosition.x, click.endPosition.y)), this._viewer.scene);
                  // if(!defined(surfacePosition)){
                  return;
                  // }
                }
                linePositions.push(surfacePosition);
                if (this._isMeasure && linePositions.length > 1) {
                  distance = this.calcSpaceDistance(linePositions);
                }
                this._pointer = true;
              }
            }
          };
          this._handler.setInputAction(
            mouseMoveHandler,
            ScreenSpaceEventType.MOUSE_MOVE
          );
        }
      }
    };
    this._handler.setInputAction(
      leftClickHandler,
      ScreenSpaceEventType.LEFT_CLICK
    );

    let rightClickHandler = (click) => {
      if (this.drawPolyline) {
        let surfacePosition = this._viewer.scene.pickPosition(click.position);
        if (!defined(surfacePosition)) {
          // surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.position.x, click.position.y)), this._viewer.scene);
          // if(!defined(surfacePosition)){
          return;
          // }
        }

        this._pointer = false;
        this._handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        linePositions.pop();
        linePositions.push(surfacePosition);
        if (this._showNode) {
          this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(function () {
              return Cartesian3.clone(surfacePosition);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });
        }

        if (this._isMeasure && linePositions.length > 1) {
          distance = this._isClampGround
            ? this.calcSpaceDistance(linePositions)
            : this.calcSpaceDistance(linePositions);
        }
        this.stopPolyline();
      }
    };
    this._handler.setInputAction(
      rightClickHandler,
      ScreenSpaceEventType.RIGHT_CLICK
    );

    if (!this._isMeasure) {
      if (this._isClampGround) {
        this._layer.entities.add({
          name: "drawing",
          corridor: {
            positions: new CallbackProperty(function () {
              let arr = [];
              for (let linePosition of linePositions) {
                arr.push(Cartesian3.clone(linePosition));
              }
              return arr;
            }, false),
            width: this._lineWidth,
            material: this._polylineColor,
          },
        });
      } else {
        this._layer.entities.add({
          name: "drawing",
          polyline: {
            positions: new CallbackProperty(function () {
              let arr = [];
              for (let linePosition of linePositions) {
                arr.push(Cartesian3.clone(linePosition));
              }
              return arr;
            }, false),
            width: this._lineWidth,
            material: this._polylineColor,
          },
        });
      }
    } else if (this._isClampGround) {
      this._layer.entities.add({
        name: "drawing",
        position: new CallbackProperty(function () {
          return Cartesian3.clone(linePositions[linePositions.length - 1]);
        }, false),
        corridor: {
          positions: new CallbackProperty(function () {
            let arr = [];
            for (let linePosition of linePositions) {
              arr.push(Cartesian3.clone(linePosition));
            }
            return arr;
            // return linePositions;
          }, false),
          width: this._lineWidth,
          material: this._polylineColor,
        },
        label: {
          text: new CallbackProperty(function () {
            return distance > 1000
              ? (distance / 1000).toFixed(5).toString() + "km"
              : distance.toFixed(3).toString() + "m";
          }, false),
          font: this._labelFont,
          fillColor: this._labelColor,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          horizontalOrigin: this._labelHorizontalOrigin,
          verticalOrigin: VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new CallbackProperty(() => {
            return this.drawElevation ||
              this.drawPolygon ||
              this.drawPolyline ||
              this.drawPoint
              ? new Cartesian2(45, 45)
              : new Cartesian2(0, 0);
          }, false),
        },
      });
    } else {
      this._layer.entities.add({
        name: "drawing",
        position: new CallbackProperty(function () {
          return Cartesian3.clone(linePositions[linePositions.length - 1]);
        }, false),
        polyline: {
          positions: new CallbackProperty(function () {
            let arr = [];
            for (let linePosition of linePositions) {
              arr.push(Cartesian3.clone(linePosition));
            }
            return arr;
            // return linePositions;
          }, false),
          width: this._lineWidth,
          material: this._polylineColor,
        },
        label: {
          text: new CallbackProperty(function () {
            return distance > 1000
              ? (distance / 1000).toFixed(5).toString() + "km"
              : distance.toFixed(3).toString() + "m";
          }, false),
          font: this._labelFont,
          fillColor: this._labelColor,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          horizontalOrigin: this._labelHorizontalOrigin,
          verticalOrigin: VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new CallbackProperty(() => {
            return this.drawElevation ||
              this.drawPolygon ||
              this.drawPolyline ||
              this.drawPoint
              ? new Cartesian2(45, 45)
              : new Cartesian2(0, 0);
          }, false),
        },
      });
    }
  }
  /**
   * 停止画线
   */
  stopPolyline() {
    this.drawPolyline = false;
    this._handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    this._handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 开始画面
   */
  startPolygon() {
    this.stopPoint();
    this.drawPolygon = true;
    let positions = [];
    let area = 0;
    let mouseMoveHandler;

    let leftClickHandler = (click) => {
      if (this.drawPolygon) {
        let surfacePosition = this._viewer.scene.pickPosition(click.position);
        if (!defined(surfacePosition)) {
          return;
        }
        positions.pop();
        positions.push(surfacePosition);
        console.log(positions.length);
        if (this._showNode) {
          this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(function () {
              return Cartesian3.clone(surfacePosition);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });
        }

        if (this._isMeasure && positions.length > 2) {
          area = this.getArea(positions);
        }
        this._pointer = false;

        if (!mouseMoveHandler) {
          mouseMoveHandler = (click) => {
            if (this.drawPolygon && positions.length > 0) {
              if (this._pointer) {
                let surfacePosition = this._viewer.scene.pickPosition(
                  click.endPosition
                );
                if (!defined(surfacePosition)) {
                  return;
                }
                positions.pop();
                // let surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.endPosition.x, click.endPosition.y)), this._viewer.scene);

                positions.push(surfacePosition);
                if (this._isMeasure && positions.length > 2) {
                  area = this.getArea(positions);
                }
              } else {
                // let surfacePosition = this._viewer.scene.globe.pick(this._viewer.scene.camera.getPickRay(new Cartesian2(click.endPosition.x, click.endPosition.y)), this._viewer.scene);
                let surfacePosition = this._viewer.scene.pickPosition(
                  click.endPosition
                );
                if (!defined(surfacePosition)) {
                  return;
                }
                positions.push(surfacePosition);
                if (this._isMeasure && positions.length > 2) {
                  area = this.getArea(positions);
                }
                this._pointer = true;
              }
            }
          };
          this._handler.setInputAction(
            mouseMoveHandler,
            ScreenSpaceEventType.MOUSE_MOVE
          );
        }
      }
    };
    this._handler.setInputAction(
      leftClickHandler,
      ScreenSpaceEventType.LEFT_CLICK
    );

    let rightClickHandler = (click) => {
      if (this.drawPolygon) {
        let surfacePosition = this._viewer.scene.pickPosition(click.position);
        if (!defined(surfacePosition)) {
          return;
        }
        this._pointer = false;
        this._handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
        positions.pop();
        positions.push(surfacePosition);
        if (this._showNode) {
          this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(function () {
              return Cartesian3.clone(surfacePosition);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });
        }

        if (this._isMeasure && positions.length > 2) {
          area = this.getArea(positions);
        }
        positions.push(positions[0]);
        this.stopPolygon();
      }
    };
    this._handler.setInputAction(
      rightClickHandler,
      ScreenSpaceEventType.RIGHT_CLICK
    );

    if (!this._isMeasure) {
      // if(positions.length===0) {
      //   return
      // }
      this._layer.entities.add({
        name: "drawing",
        // position : new CallbackProperty(function() {
        //     return Cartesian3.clone(positions[positions.length - 1]);
        // }, false),
        polygon: {
          hierarchy: new CallbackProperty(function () {
            let arr = [];
            for (let linePosition of positions) {
              arr.push(Cartesian3.clone(linePosition));
            }
            return new PolygonHierarchy(arr);
          }, false),
          material: this._polygonColor,
          perPositionHeight: !this._isClampGround,
        },
      });
    } else {
      // if(positions.length===0) {
      //   return
      // }
      this._layer.entities.add({
        name: "drawing",
        position: new CallbackProperty(function () {
          return Cartesian3.clone(positions[positions.length - 1]);
        }, false),
        // polyline : {
        //     positions : new CallbackProperty(function() {
        //         let arr = [];
        //         for(let linePosition of positions){
        //             arr.push(Cartesian3.clone(linePosition));
        //         }
        //         return arr;
        //         // return positions;
        //     }, false),
        //     width : this._lineWidth,
        //     material : this._polylineColor,
        //     followSurface : !this._isClampGround
        // },
        polygon: {
          hierarchy: new CallbackProperty(function () {
            let arr = [];
            for (let linePosition of positions) {
              arr.push(Cartesian3.clone(linePosition));
            }
            return new PolygonHierarchy(arr);
            // return positions;
          }, false),
          material: this._polygonColor,
          perPositionHeight: !this._isClampGround,
        },
        label: {
          text: new CallbackProperty(function () {
            return area > 1e6
              ? (area / 1e6).toFixed(5).toString() + "平方公里"
              : area.toFixed(5).toString() + "平方米";
          }, false),
          font: this._labelFont,
          fillColor: this._labelColor,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          horizontalOrigin: this._labelHorizontalOrigin,
          verticalOrigin: VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new CallbackProperty(() => {
            return this.drawElevation ||
              this.drawPolygon ||
              this.drawPolyline ||
              this.drawPoint
              ? new Cartesian2(45, 45)
              : new Cartesian2(0, 0);
          }, false),
          // pixelOffset: new Cartesian2(75, 75)
        },
      });
    }
  }
  /**
   * 停止画面
   */
  stopPolygon() {
    this.drawPolygon = false;
    this._handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    this._handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 开始量高
   */
  startElevation() {
    if (!this._isMeasure) {
      return;
    }
    this.stopPoint();
    this.drawElevation = true;
    let startPos, movePos, verticalPos;
    let startPosDegree, movePosDegree;
    let mouseMoveHandler;
    let verticalDis = 0; // 垂直距离
    let horiDis = 0; // 水平距离
    let spaceDis = 0; // 空间距离
    let flag = false;
    var endFlag = false;
    let clicked;
    let leftClickHandler = (click) => {
      if (this.drawElevation) {
        if (!endFlag) {
          clicked = false;
          startPos = this._viewer.scene.pickPosition(click.position);
          clicked = true;
          // let pris = this._viewer.scene.drillPick(click.position);
          if (!defined(startPos)) {
            return;
          }
          startPosDegree = Cartographic.fromCartesian(startPos);
          endFlag = true;
          this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(function () {
              return Cartesian3.clone(startPos);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });

          mouseMoveHandler = (click) => {
            movePos = this._viewer.scene.pickPosition(click.endPosition); // 就用pickPosition，别用pick，有问题
            if (!defined(movePos)) {
              return;
            }
            movePosDegree = Cartographic.fromCartesian(movePos);

            if (startPosDegree.height > movePosDegree.height) {
              verticalPos = Cartesian3.fromRadians(
                movePosDegree.longitude,
                movePosDegree.latitude,
                startPosDegree.height
              );

              horiDis = Cartesian3.distance(startPos, verticalPos);
              horiDis =
                spaceDis > 1000
                  ? (horiDis / 1000).toFixed(5).toString() + "km"
                  : horiDis.toFixed(3).toString() + "m";
              verticalDis = Cartesian3.distance(movePos, verticalPos);
              verticalDis =
                spaceDis > 1000
                  ? (verticalDis / 1000).toFixed(5).toString() + "km"
                  : verticalDis.toFixed(3).toString() + "m";

              flag = true; // verticalPos在movePos之上
            } else {
              verticalPos = Cartesian3.fromRadians(
                startPosDegree.longitude,
                startPosDegree.latitude,
                movePosDegree.height
              );

              verticalDis = Cartesian3.distance(startPos, verticalPos);
              verticalDis =
                spaceDis > 1000
                  ? (verticalDis / 1000).toFixed(5).toString() + "km"
                  : verticalDis.toFixed(3).toString() + "m";
              horiDis = Cartesian3.distance(movePos, verticalPos);
              horiDis =
                spaceDis > 1000
                  ? (horiDis / 1000).toFixed(5).toString() + "km"
                  : horiDis.toFixed(3).toString() + "m";

              flag = false; // verticalPos在startPos之上
            }

            spaceDis = Cartesian3.distance(startPos, movePos);
            spaceDis =
              spaceDis > 1000
                ? (spaceDis / 1000).toFixed(5).toString() + "km"
                : spaceDis.toFixed(3).toString() + "m";
          };
          this._handler.setInputAction(
            mouseMoveHandler,
            ScreenSpaceEventType.MOUSE_MOVE
          );
        } else {
          let movePos = this._viewer.scene.pickPosition(click.position);
          if (!defined(movePos)) {
            return;
          }
          this._handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);

          movePosDegree = Cartographic.fromCartesian(movePos);

          if (startPosDegree.height > movePosDegree.height) {
            verticalPos = Cartesian3.fromRadians(
              movePosDegree.longitude,
              movePosDegree.latitude,
              startPosDegree.height
            );

            horiDis = Cartesian3.distance(startPos, verticalPos);
            horiDis =
              spaceDis > 1000
                ? (horiDis / 1000).toFixed(5).toString() + "km"
                : horiDis.toFixed(3).toString() + "m";
            verticalDis = Cartesian3.distance(movePos, verticalPos);
            verticalDis =
              spaceDis > 1000
                ? (verticalDis / 1000).toFixed(5).toString() + "km"
                : verticalDis.toFixed(3).toString() + "m";

            flag = true; // verticalPos在movePos之上
          } else {
            verticalPos = Cartesian3.fromRadians(
              startPosDegree.longitude,
              startPosDegree.latitude,
              movePosDegree.height
            );

            verticalDis = Cartesian3.distance(startPos, verticalPos);
            verticalDis =
              spaceDis > 1000
                ? (verticalDis / 1000).toFixed(5).toString() + "km"
                : verticalDis.toFixed(3).toString() + "m";
            horiDis = Cartesian3.distance(movePos, verticalPos);
            horiDis =
              spaceDis > 1000
                ? (horiDis / 1000).toFixed(5).toString() + "km"
                : horiDis.toFixed(3).toString() + "m";

            flag = false; // verticalPos在startPos之上
          }
          this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(function () {
              return Cartesian3.clone(verticalPos);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });
          this._layer.entities.add({
            name: "drawing",
            position: new CallbackProperty(function () {
              return Cartesian3.clone(movePos);
            }, true),
            point: {
              pixelSize: 10,
              color: this._pointColor,
              heightReference: HeightReference.NONE,
            },
          });

          spaceDis = Cartesian3.distance(startPos, movePos);
          spaceDis =
            spaceDis > 1000
              ? (spaceDis / 1000).toFixed(5).toString() + "km"
              : spaceDis.toFixed(3).toString() + "m";

          this.stopElevation();
        }
      }
    };
    this._handler.setInputAction(
      leftClickHandler,
      ScreenSpaceEventType.LEFT_CLICK
    );
    // 空间线
    this._layer.entities.add({
      name: "drawing",
      position: new CallbackProperty(function () {
        return startPos && movePos
          ? Cartesian3.lerp(
              Cartesian3.clone(startPos),
              Cartesian3.clone(movePos),
              0.5,
              new Cartesian3()
            )
          : undefined;
      }, false),
      polyline: {
        positions: new CallbackProperty(function () {
          return startPos && movePos ? [startPos, movePos] : [];
        }, false),
        width: this._lineWidth,
        material: this._polylineColor,
      },
      label: {
        text: new CallbackProperty(function () {
          return "空间距离：" + spaceDis;
        }, false),
        font: this._labelFont,
        fillColor: this._labelColor,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        style: LabelStyle.FILL_AND_OUTLINE,
        showBackground: true,
        horizontalOrigin: HorizontalOrigin.CENTER,
        verticalOrigin: VerticalOrigin.TOP,
        show: new CallbackProperty(function () {
          return clicked;
        }, false),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    this._layer.entities.add({
      name: "drawing",
      position: new CallbackProperty(function () {
        return startPos && verticalPos
          ? Cartesian3.lerp(
              Cartesian3.clone(startPos),
              Cartesian3.clone(verticalPos),
              0.5,
              new Cartesian3()
            )
          : undefined;
      }, false),
      polyline: {
        positions: new CallbackProperty(function () {
          return startPos && verticalPos ? [startPos, verticalPos] : [];
        }, false),
        width: this._lineWidth,
        material: this._polylineColor,
      },
      label: {
        text: new CallbackProperty(function () {
          return flag ? "水平距离：" + horiDis : "垂直距离：" + verticalDis;
        }, false),
        font: this._labelFont,
        fillColor: this._labelColor,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        style: LabelStyle.FILL_AND_OUTLINE,
        showBackground: true,
        horizontalOrigin: HorizontalOrigin.CENTER,
        verticalOrigin: VerticalOrigin.BOTTOM,
        show: new CallbackProperty(function () {
          return clicked;
        }, false),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    this._layer.entities.add({
      name: "drawing",
      position: new CallbackProperty(function () {
        return movePos && verticalPos
          ? Cartesian3.lerp(
              Cartesian3.clone(movePos),
              Cartesian3.clone(verticalPos),
              0.5,
              new Cartesian3()
            )
          : undefined;
      }, false),
      polyline: {
        positions: new CallbackProperty(function () {
          return verticalPos && movePos ? [verticalPos, movePos] : [];
        }, false),
        width: this._lineWidth,
        material: this._polylineColor,
      },
      label: {
        text: new CallbackProperty(function () {
          return !flag ? "水平距离：" + horiDis : "垂直距离：" + verticalDis;
        }, false),
        font: this._labelFont,
        fillColor: this._labelColor,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        style: LabelStyle.FILL_AND_OUTLINE,
        showBackground: true,
        horizontalOrigin: HorizontalOrigin.CENTER,
        verticalOrigin: VerticalOrigin.BOTTOM,
        show: new CallbackProperty(function () {
          return clicked;
        }, false),
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 取消深度测试，
      },
    });
  }
  /**
   * 停止量高
   */
  stopElevation() {
    this.drawElevation = false;
    this._handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    this._handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 移除图层
   */
  removeAll() {
    this.stopPoint();
    this.stopPolyline();
    this.stopPolygon();
    this.stopElevation();
    this._layer.entities.removeAll();
  }
  /**
   * 销毁该实例
   */
  destroy() {
    this._viewer.dataSources.remove(this._layer);
    destroyObject(this);
  }
  /**
   * 获取面积
   */
  getArea(positions) {
    return Math.abs(PolygonPipeline.computeArea2D(positions));
  }
  /**
   * 计算空间直线距离
   */
  calcSpaceDistance(positions) {
    var len = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      len += Cartesian3.distance(positions[i], positions[i + 1]);
    }
    return len;
  }
}
