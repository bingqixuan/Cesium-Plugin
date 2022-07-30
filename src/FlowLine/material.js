import {Material, Color} from "cesium";
import {materialSource} from "./materialsource";

export const MaterialType = "PolylineFlow";

Material.PolylineFlowType = MaterialType;
Material._materialCache.addMaterial(MaterialType, {
  fabric: {
    type: Material.PolylineFlowType,
    uniforms: {
      color: Color.RED,
      image: "",
      imageHorizontalLength: 1024.0,
      lineHorizonlLength: 0.0,
      phaseOffset: 0.0, // 相位偏差
    },
    source: materialSource,
  },
});
