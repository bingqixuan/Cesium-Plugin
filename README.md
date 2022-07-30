# Cesium-Plugin

采用ts+rollup编写的Cesium插件，适配cesium版本（1.70+）。

## 打包

```bash
npm install
npm run build
```

## 前端加载

在前端页面用script标签引入即可。

```html
    <script src="https://cesium.com/downloads/cesiumjs/releases/1.74/Build/Cesium/Cesium.js"></script>
    <script src="../dist/cesium-plugin.js"></script>
```

利用全局变量CesiumPlugin进行开发。

```javascript
    const a = CesiumPlugin.Calculation.getBearing(Cesium.Cartesian3.fromDegrees(112, 34), Cesium.Cartesian3.fromDegrees(112, 38));
    console.log(a);
```

## 功能列表

- 数据计算
- 测量功能（长度、面积、高度）
- 右键功能
- 流动线效果
