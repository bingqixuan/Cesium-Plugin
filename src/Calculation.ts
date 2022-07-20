// const Ces:any = (<any>window).Cesium;
import { Cartographic, Math as CesiumMath, Cartesian3 } from "cesium";

export class Calculation {
  public static getBearing(startPoint: Cartesian3, endPoint: Cartesian3) {
    const start = Cartographic.fromCartesian(startPoint);
    const end = Cartographic.fromCartesian(endPoint);

    const y =
      Math.sin(end.longitude - start.longitude) * Math.cos(end.latitude);
    const x =
      Math.cos(start.latitude) * Math.sin(end.latitude) -
      Math.sin(start.latitude) *
        Math.cos(end.latitude) *
        Math.cos(end.longitude - start.longitude);

    const bearing = Math.atan2(y, x);
    return CesiumMath.toDegrees(bearing);
  }
}
