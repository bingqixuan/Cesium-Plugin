import { MaterialType } from "./material";
import defaultFlowlineImg from "./flowLine.png";

import { ConstantProperty, defaultValue, Event, Color } from 'cesium';

class PolylineFlowMaterialProperty {
  /**
   * 流动线，相比 {@link PolylineTrailLinkMaterialProperty},此材质仅仅会用到图片的alpha通道
   * @param {Object} [options={}] 具有以下属性
   * @param {Color} [options.color=Color.RED] 颜色
   * @param {Number} [options.duration=1000] 动画的周期，值越小动画越快，单位毫秒
   * @param {Number} [options.imageHorizontalLength] 图片水平方向的实际长度
   * @param {String|Resource} [options.image] 需要映射到材质的图片
   *
   * @see PolylineTrailLinkMaterialProperty
   */
  constructor(options = {}) {
    this._color = defaultValue(options.color, Color.RED);
    this._colorProp = new ConstantProperty(this._color);
    this._phaseOffset = 0;
    this._image = defaultValue(options.image, defaultFlowlineImg);
    this._duration = defaultValue(options.duration, 1000);
    this._imageHorizontalLength = defaultValue(
      options.imageHorizontalLength,
      1024
    );
    this._definitionChanged = new Event();
  }

  /**
   * 线颜色
   * TODO: 该属性要求返回Cesium.Property对象
   * 可见：StaticGroundPolylinePerMaterialBatch.js L207-L225
   * @type {Color}
   */
  get color() {
    return this._colorProp;
  }
  get phaseOffset() {
    return this._phaseOffset;
  }
  /**
   * 将要映射到纹理的图形
   * @type {String|Resource}
   */
  get image() {
    return this._image;
  }
  set image(v) {
    this._image = v;
  }
  /**
   * 图片水平方向的长度
   */
  get imageHorizontalLength() {
    return this._imageHorizontalLength;
  }
  set imageHorizontalLength(v) {
    this._imageHorizontalLength = v;
  }
  /**
   * 材质发生变化时触发的事件
   * @Event
   */
  get definitionChanged() {
    return this._definitionChanged;
  }

  /**
   * 获取一个值，该值指示此属性是否恒定。如果getValue对于当前定义始终返回相同的结果，则该属性被视为常量。
   * @readonly
   */
  get isConstant() {
    return false;
  }
  set color(v) {
    this._color = v;
  }
  /**
   * 动画周期。
   * @type {Number}
   */
  get duration() {
    return this._duration;
  }
  set duration(v) {
    this._duration = v;
  }
  /**
   * 此属性的类型
   * @return {String}
   */
  getType(time) {
    return MaterialType;
  }
  /**
   * 获取指定时间的属性值。
   * @param  {JulianDate} time  时间
   * @param  {Object} [result] 保存新属性的副本，如果没有指定将自动创建。
   * @return {Object} 修改后的result,如果未提供result参数，则为新实例。
   */
  getValue(time, result) {
    result = defaultValue(result, {});
    result.color = this._color;
    result.image = this.image;
    result.imageHorizontalLength = this._imageHorizontalLength;
    result.phaseOffset = this._phaseOffset = (Date.now() / this._duration) % 1;
    return result;
  }

  /**
   * 判断两个材质是否相同
   * @param  {PolylineFlowMaterialProperty} other 作为对比的另一个材质
   * @return {Bool}   两个材质相同返回true,否则返回false
   */
  equals(other) {
    return (
      this === other ||
      (other instanceof PolylineFlowMaterialProperty &&
        this.color === other.color &&
        this.image === other.image &&
        this._imageHorizontalLength === other._imageHorizontalLength)
    );
  }
}

export default PolylineFlowMaterialProperty;
