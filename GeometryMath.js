/**
 * Created by rick on 2018/5/3.
 */
(function () {
    function GeometryMath() {

    }

    /**
     * 计算Polygon的质心
     * @param positions [Array]
     * @returns {Cesium.Cartographic}
     */
    GeometryMath.computeCentroidOfPolygon = function (positions) {
        var x = [];
        var y = [];

        for (var i = 0; i < positions.length; i++ ) {
            var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

            x.push(cartographic.longitude);
            y.push(cartographic.latitude);
        }

        var x0 = 0.0, y0 = 0.0 , x1 = 0.0, y1 = 0.0;
        var signedArea = 0.0;
        var a = 0.0;
        var centroidx = 0.0, centroidy = 0.0;

        for (i = 0; i < positions.length ; i ++) {
            x0 = x[i];
            y0 = y[i];

            if ( i == positions.length -1 ) {
                x1 = x[0];
                y1 = y[0];
            } else {
                x1 = x[i + 1];
                y1 = y[i + 1];
            }

            a = x0 * y1 - x1 * y0;
            signedArea += a;
            centroidx += (x0 + x1) * a;
            centroidy += (y0 + y1) * a;
        }

        signedArea *= 0.5;
        centroidx /= (6.0 * signedArea);
        centroidy /= (6.0 * signedArea);

        return new Cesium.Cartographic(centroidx, centroidy);
    };

    /**
     * 计算面积
     * @param pos1 {Cartesian3} 第一点
     * @param pos2 {Cartesian3} 第二点
     * @param pos3 {Cartesian3} 第三点
     * @returns {number}
     */
    GeometryMath.computeAreaOfTriangle = function(pos1, pos2, pos3)
    {
        var a = Cesium.Cartesian3.distance(pos1, pos2);
        var b = Cesium.Cartesian3.distance(pos2, pos3);
        var c = Cesium.Cartesian3.distance(pos3, pos1);

        var S = (a + b + c) / 2;

        return Math.sqrt(S * (S - a) * (S - b) * (S - c));
    }
    Cesium.GeometryMath = GeometryMath;
})();