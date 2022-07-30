export const materialSource = `varying float v_polylineAngle;

mat2 rotate(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat2(
        c, s,
        -s, c
    );
}

czm_material czm_getMaterial(czm_materialInput materialInput) {
    vec2 st = materialInput.st;

    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;
    float imgHorizontalNumber = pos.x / imageHorizontalLength;
    float imageHorizontalFrac = imgHorizontalNumber - floor(imgHorizontalNumber);
    // 加上相位，图片向前移动，整体看起来向后移动，所以需要减去相位
    imageHorizontalFrac = fract(imageHorizontalFrac + 1.0 - phaseOffset);
    vec4 imageRgba = texture2D(image, vec2(imageHorizontalFrac, st.t));

    czm_material material = czm_getDefaultMaterial(materialInput);
    material.alpha = imageRgba.a * color.a;
    material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);

    return material;
  }`;