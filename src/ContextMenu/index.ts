/*
 * @Description: 入口及菜单生成
 * @Author: Jin（https://github.com/ElevenIjusee?tab=repositories）
 * @Date: 2022-04-27 13:30:05
 * @LastEditors: Jin
 * @LastEditTime: 2022-04-27 22:15:54
 */
import {Viewer,EllipsoidTerrainProvider,createWorldTerrain} from 'cesium';
import Menu from './contextmenu/menu';
import CatCesium from './cesiumsdk/cat';
import './contextmenu/styles.css';
export class ContextMenu {

	private catCesium: CatCesium;

	constructor(viewer: Viewer, id: string = '') {
		this.catCesium = new CatCesium(viewer, id);
		this.initMenu(viewer);
	};

	private initMenu(viewer: Viewer): void {

		const list: Array<I_list> = [
			{
				"text": "查看此处坐标",
				"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAWZJREFUOE+F0z9IVmEUx/GPODhLkxI0SNCeBEqIFf2HQMxEIRdBHWpocBACi4pqKCjIoUFzEkMnERchFQmCmpwE07XWpLk4cV64PL2+PnC53Oec8z2/8+c2qX9GcA1n0YZv+UzjdzWkqYg/gZe4g2fYxy+cwnmcw3Uc1OJKwBracQU/64i7j7ep6kfYq4CQ/SSzhW0AITlKmMVkAl+jEz0lYAtvsIzI9DTL+I5+NGMQJ7GHPqxVFURdl9M4l5mjkTU1H3EGuwhoJJirAv5USjoO8AmbeFQFfMZ7fMCDMGYJIfd2KrqQimIyF/G1CniHVgyn0wTuZeASonkhvxvzOF02sSuagnEsHrFgcR0+63hVAuJ7FI9xKbOVnOc5wmj2v1MuUty9yK27WqztGB7iJnYaAcK2kA5D+b6BVdzCSqN/oWZrwQa+5FRiZFOYKWuqV0LNpwPbOMztDMB/pxEgnHuzsXePmspfSh1HEUyY2wUAAAAASUVORK5CYII="/>',
				"events": {
					"click": () => {
						this.catCesium.getLocalPos();
					}
				}
			},
			{
				"text": "查看当前视角",
				"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAQVJREFUOE+d078uRUEQx/HPjUJE5wUkXoGEDsntREeiVdJJJIgC1VXpJOIpJKjRaCjUKoUH4AnInOyy2Rz3YKozO7/9zp8z28OHb7vFYuG3fd5gIQd6CXBUKA87AGX8oAR0Xay5oW8AUVKUXlbRUUQTDsB8AH6yPqYwiteU6K0WtwFmsY9lXGM8De0pVXlRQmrAKs4wgTmM4D4BotWwjaRpnBKwhZMkesEKHrGO8DcRCcL2cFwDdjFoAcTRDHa6ACGMLKcJEi2MFf12tpC1a9jGdDXES5zjatgQy9gSJvGOBzy3/e+8SHdpMX6zQFnztUjxmGIL/73KGVCSh1XS+pjyhT8/5099HzeJvxy+sQAAAABJRU5ErkJggg=="/>',
				"events": {
					"click": () => {
						this.catCesium.getCameraInfo();
					}
				}
			},
			{
				"text": "视角切换",
				"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMRJREFUOE+l0z1qgkEQh/GfN8g5tPACKfQGtgrGIifwAip4AO9gI9iIBIJWSRns9Bgp0trKFIK87m78mGrZmX3+s/NR86TVnnwvBZhheCu4ClihQxKcZJ4BL/jAa0a5je+ULwB1LNEopB2AA/6qMfdk0MIndpeQXA1CsWoBGKOHxdlZ6sJXBhLXI0zjUJqDAIRqzuYYPAo4oot1CTBJSEcNfvGG7X9fqL4PYB/vlzNxzy4EYIOfUhtLK9DEPjdIt+7OVdwJg18dESRWE5AAAAAASUVORK5CYII="/>',
				"sub": [
					{
						"text": "环绕此处飞行",
						"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAARpJREFUOE+l070rhmEUBvDfu0hZDCaDLEqJEhEJo0lCklJKGGwmk4+/gEkxs7xlkIVJNoOPklgtTP4CC526n3p6PV5ezvLUfV/neq7rus8p+WeV/tDfi+usrxaCPsziHeu1EHRjDdu4wwhuf0PQgQ0MoAUvaERD3naRhTZsYQ6nGMcT2nGI+e8IWrGJhQQIybs4Q386m8DJTwqCqBMP6Y+DuYYviuNgEl1Jdp78ApdYQjPOMZYDhM37IDjGVME87GMFPVjGDQ4qcOUgCKZpjOItB4g8IoesmiruP+I+8xSJHyVkfB9Rh8gjCzVyGcJiUrUT81H0jAGYwTDqk4py8v+KZ1z9ZpBC4h5Wq+1LtV2IkY1XqFq1LFMh0ScNhy6NeddftgAAAABJRU5ErkJggg=="/>',
						"events": {
							"click": () => {
								if (roundLook.innerHTML === '环绕此处飞行') {
									roundLook.innerHTML = '停止环绕';
									this.catCesium.arroundFly();
								} else {
									roundLook.innerHTML = '环绕此处飞行';
									this.catCesium.stopArround();

								}
							}
						}
					},
					{
						"text": "移动到此处",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAN1JREFUOE+Vk+ERATEQRt9VQAk6QAWohBLoQAlK0AkqcDpQAhUw7yaZiZsk5/Znsvv222+ThnrMwvWzlNZU6hfAJdxvgDaXWwLE4mkoegFZSAlwAoSkgCtw7KuojWCuRcb6Hw/suAUOSXIOcAZU2HkSFcSZH71uOYBn8+iJAFd1D/NK1bAYgo10A/riuXnLCDBhAqjgH4AK3oLSEZSmEtcVozSCCjS2Tbfg4Q7YDwA0UCN/TCxtadQaU4hdVsmWPsCtp67Lrz1lu2usoWHdzGNeop6kI4z6TLHR4Hf+AmxvMFFs2Zg+AAAAAElFTkSuQmCC" />',
						"events": {
							"click": () => {
								this.catCesium.moveToRightClick();
							}
						}
					},
					{
						"text": "第一视角站到此处",
						"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAANFJREFUOE+lkz0SAUEQhb8NpYQSHMAl5AJVBCQ4hBJKXQIJgZ9U6A4cAImQxAGoVq1qdmxP7ZSOpnrf+/btq9mEPycJ+OvATJ8PgVOWNgS4A0U1PYBSDKACXDxDFbj6kFCCOdBXwwIYxCT4ast6uFldWQkmjuGlZ9G6+886CyDfejbeWPO7sRJIgVKkO1KgwFNjAZZA19OugF5eQBtYe+IOsMkLEN0ImKphCwj0Z0L3oAXs1DF2YLk6EJH8C0dVN4BDbIICsFdTE3jGAqzLl9q/AfG7GxGuIQRzAAAAAElFTkSuQmCC"/>',
						"events": {
							"click": () => {
								this.catCesium.standRightClick();
							}
						}
					}
				]
			},
			{
				"text": "地形服务",
				"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAR9JREFUOE+l07ErRlEcxvHPayADSjGJxS6LshkMdoMMRinZsFGvpCT+AmUWpYySDEqZpDBRIoNSBgai6NS5b6fbfXtf/Op2zz3nPN/nOfecU/LPKtWh78d5tXm1ANMIgMm/Ai7whQlcF0FqJdjFPZow8xvADm7wiAfsoxe3eUi1BN94RzM68YQNzNUDGMJ4/HENUXCGAXTFVBVOUYLgHvo/4trD5DXMYwULaYo8oA+b0W0LbRjFGLajsAPPGSQPCO7teMEwDqP4CpdRtIRyEaAbJ+hJIt7F72B0isE41orX0E4THGMVBwlgHbM4its6lU+RAVriusKBSSs4BudQi1hOBhvxmQH2MBJjvSE8IWL6ztphd7L05VpHudodqvT/AJYaOhEr2SIRAAAAAElFTkSuQmCC"/>',
				"sub": [
					{
						"text": "开启地形",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAR9JREFUOE+l07ErRlEcxvHPayADSjGJxS6LshkMdoMMRinZsFGvpCT+AmUWpYySDEqZpDBRIoNSBgai6NS5b6fbfXtf/Op2zz3nPN/nOfecU/LPKtWh78d5tXm1ANMIgMm/Ai7whQlcF0FqJdjFPZow8xvADm7wiAfsoxe3eUi1BN94RzM68YQNzNUDGMJ4/HENUXCGAXTFVBVOUYLgHvo/4trD5DXMYwULaYo8oA+b0W0LbRjFGLajsAPPGSQPCO7teMEwDqP4CpdRtIRyEaAbJ+hJIt7F72B0isE41orX0E4THGMVBwlgHbM4its6lU+RAVriusKBSSs4BudQi1hOBhvxmQH2MBJjvSE8IWL6ztphd7L05VpHudodqvT/AJYaOhEr2SIRAAAAAElFTkSuQmCC" />',
						"events": {
							"click": () => {
								if (closeTerrain.innerHTML === '关闭地形') {
									closeTerrain.innerHTML = '开启地形';
									viewer.terrainProvider = new EllipsoidTerrainProvider();
								} else {
									closeTerrain.innerHTML = '关闭地形';
									viewer.terrainProvider = createWorldTerrain();
								}
							}
						}
					},
					{
						"text": "显示三角网",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAASxJREFUOE+lkw1tAkEQRt8poA4KDqiDVgFFAZWAA6iC1kHrAOoAFIADqAPqoHmXGbLscQkJk0yyOz/ffDM723CnND35z8AEGId/D/wAmzq+BngAVsATMAD+gBPwGOcdMA1bi1UCmHwA3gEZmHiMip5lJIslMEyQEkB6Vv0MfQXeAuAbSNUu4EvJwIoZMI/KBllJkYkMvVtAYIH2yUCjCdIzuHXGXQDtAiRQ3ucJIH37N0CnqshMyemnTyYj/SWAyeoiBnkNIH0CqGeAW1owwbZspdNCDvELcIj5hGUL9RDdh/MQs89E90UEchMFs7ILZpLVtbXg9SI5g4/YuhmwjWBfZR0DFfjqIumXgYGurmdVsaL6G0/subPK5T+RustSfibbspUL6fuNdVzv/R+G8lQRIdDXsQAAAABJRU5ErkJggg==" />',
						"events": {
							"click": () => {
								if (closeTriangle.innerHTML === '显示三角网') {
									closeTriangle.innerHTML = '关闭三角网';
									this.catCesium.openEarthTriangle(true);
								} else {
									closeTriangle.innerHTML = '显示三角网';
									this.catCesium.openEarthTriangle(false);
								}
							}
						}
					},
					{
						"text": "开启地表透明",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAItJREFUOE9jZKAQMEL1p6GZMwuJb4zEfsbAwPAcWS2yATBDzjIwMKQjKUI2fDNNDYA5lZ+BgaEOyQVqSOybDAwML5D4n2FeQPYWSEMxkgCyd0ByvFA5cHgMHgNAIT3wsUCRC5BTmxwDA4MSUiwsQ2KDxF9D+Z8HVyygJyTk1LcFSVISLdNhTUgkZXAAHOUwEcdYxdcAAAAASUVORK5CYII=" />',
						"events": {
							"click": () => {
								if (openTerOpc.innerHTML === '开启地表透明') {
									openTerOpc.innerHTML = '关闭地表透明';
									this.catCesium.openEarthOpt(true);
								} else {
									openTerOpc.innerHTML = '开启地表透明';
									this.catCesium.openEarthOpt(false);
								}
							}
						}
					},
				]
			},
			{
				"text": "场景设置",
				"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAATpJREFUOE+l078rr2EYBvDPd1esZ5fFqDhZ9E0G4QyGswkTwkAMMqDIQAyHnDM5Mpr8yiDJokP5D4zKYDnq/AF6dL/1Pa/3jfIsd93PfV/Pfd3X9VR88lRK+lvwjPu4b0Q97vL1eYA6rGE0Cs8idkf8iVn8y4DyAIvowBL+YjAK99CABVwh1b2ePMAubrFTQm0MrRguAmjDb8zgFN/QF4XHOEIP1jGEm9oJJrGCOWyjF6lpMwCmAuwE41jFPH5kFC5z3H7hsYZr4vwFIwGY7ar6UYAmLON7GUBCTBueKKBwGNNle0sUtkKpxVoVuuJiOrfEZKJqdKclbsRD50Uy7uP6HRnbMVDmg7Tdr+8Y6U+oVWik5PckXWaUi3ipM+JByPhUNkGW78dDuDLlkvuakZz63yn7jSVOfpt+AT3QQxF/2bCZAAAAAElFTkSuQmCC"/>',
				"sub": [
					{
						"text": "开启深度检测",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAM9JREFUOE/t0zFOQlEQheGPRVDY0bMBSm3cAa0BCkzsYAPCArQzxoJATU8PiY02NMaOLbgFyST3JYLx5oKUTPXefef8mZlzX01ZjXCPJj5zlloZz3fSLXF1Bu5sILfDC9wmdQQSFTtcpecI6lflgI8YZALoYrb/PQfs4yUDjLSj4+KRQzjEw57nCzdYHDpype9hkl426OD1r85LL3Ybl3jGxykuduEPxc8On3BX7NwVvqEVRxUwRpofCatsY4wCWMc7Gv8Ehv06gNOU3Al41lszvyAkHmA4KQAAAABJRU5ErkJggg==" />',
						"events": {
							"click": () => {
								if (terrTest.innerHTML === '开启深度检测') {
									terrTest.innerHTML = '关闭深度检测';
									this.catCesium.openDepthTestAgainstTerrain(true);
								} else {
									terrTest.innerHTML = '开启深度检测';
									this.catCesium.openDepthTestAgainstTerrain(false);
								}
							}
						}
					},
					{
						"text": "关闭大气渲染",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAAAAXNSR0IArs4c6QAAAPBJREFUOE+t1LEuREEUANCztWyjofQFGgSlSkOisZX4BolaENERLVttsoXEqhEJ2Y4QJcV+AHo+QG6yL3l5eW+tNVPOvffcO8nM1AxeK1jDAqbwhiuc4WNQaa0iOI4WVivi7zjAaRVeBbex8ctpIryEblleGbyMmyHQSOnhEve4y9eUwXvYHRLOp71gB9exWYRncIiYetTVQCcPX2B9VK1QN5nBKdHocRzwFk4STZox3YCfMJcY/gr4G2OJ4V7Aj5hPDJ8HfITtxPBmwBP4TAh30Miu2zRu+03+0yNe32zx5dWx3/8iF/+gv+IZD2hmdT+/piVBa7DUQQAAAABJRU5ErkJggg==" />',
						"events": {
							"click": () => {
								if (closeAtmo.innerHTML === '关闭大气渲染') {
									closeAtmo.innerHTML = '开启大气渲染';
									this.catCesium.openSkyAtmosphere(false);
								} else {
									closeAtmo.innerHTML = '关闭大气渲染';
									this.catCesium.openSkyAtmosphere(true);
								}
							}
						}
					},
					{
						"text": "开启光照效果",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAALlJREFUOE+tkw0NwjAQhb85wcGQgAOQsDmYBHAACgYOkIAEJEzK8pYrOS5dmlGWLE3au/fXa0Pl11T2UwI4GcFzjSgHsAMmaziH1Z8tRxFABS9AzO/Augek5OAIshZUKAUDcHQWboAIvoDXMpB0qegM4G7sydJHnAdQQwtcjEXNiU2qBKJVINpfgo0AvmAzgM9MLPLf2+YIPIBrvM5cBj7ENAeSr78Y4l+usWqQosWfRnnT+yo9piLYDKfsKhFJRhyXAAAAAElFTkSuQmCC" />',
						"events": {
							"click": () => {
								if (openSun.innerHTML === '开启光照效果') {
									openSun.innerHTML = '关闭光照效果';
									this.catCesium.openSun(true);
								} else {
									openSun.innerHTML = '开启光照效果';
									this.catCesium.openSun(false);
								}
							}
						}
					},
					{
						"text": "场景截图",
						"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAGBJREFUOE9jZEAF/6FcRjRxnFx0hWQZANNErKUgdQcYGBgcQQyQC8gxAKYXbAAyIMYLKGrwGYDNZcguBusd5gbgilaiApHoNIEeiPsZGBgciNaNJRaI0YvXC0PDABRXAgD0CxoPOCDlxQAAAABJRU5ErkJggg=="/>',
						"events": {
							"click": () => {
								this.catCesium.printscreen();
							}
						}
					}
				]
			},
			{
				"text": "视觉特效",
				"icon": '<img src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAN1JREFUOE+t06FOwzEQx/HPNA9CMgQCHGYKFDimUBsKPzQGwxsQwoJAIRcEycQwiCUgWTZ4AzyKEMgl908aMrXSpGna633vd9drS+VoVfpbBuhhB+s5f/CKN0wxLIOWgHA6xQHG6fSCL2xiC7sY4QJPAWoAe3jANW7xmFHa+MYi9x0coZ+wcQCCHNQrnBXy7nCY+1CyXdji3jH2A3CJtSQ3d55xn0o+0EWoibUZEeAzAO84x01aonhzbGBWSJ/8OTvB4F8A1SlUFzHSrHrGpqpVjVR258qtvNK/qv6Nv4S3S2/sRinfAAAAAElFTkSuQmCC"/>',
				"sub": [
					{
						"text": "开启夜视效果",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAANxJREFUOE+l0i9Lw0EYB/DPqmX4BiwG+4IoOJjBP2UvYEXWBN+CghvMZLGYTCaDTWRgWtYiDEwWkwbBINjHjd8PDt3mHnblyn0/dzz3rYitG7TySCWWd4k2tvGUslGggUFx6Ti7CHCGk0WA9ID9KHDEeA7l6kaBOzQz4CECrGCIagZ8R4BrHPz69rd5gQ5OJ3Sm/x+whivUpxTuPAGpnl+4zQ6tYge7WJ4SfsFW+YIfLAVrXcNzCazjMQB0kebyp8o9HM+A3nGI+/LMpCHuYRMbxf5Z/P8rLvCRXzACr28hr2v0o20AAAAASUVORK5CYII=" />',
						"events": {
							"click": () => {
								if (nightVision.innerHTML === '开启夜视效果') {
									nightVision.innerHTML = '关闭夜视效果';
									this.catCesium.openNightVision(true);
								} else {
									nightVision.innerHTML = '开启夜视效果';
									this.catCesium.openNightVision(false);
								}
							}
						}
					},
					{
						"text": "开启黑白效果",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAN5JREFUOE+l0z9KQ0EQx/FPbhLBxiYWgp2lRzBVLJLCP6ew8Q4ai1jESo+Q0i5goRZaJKAnUTbsg83wjHm8hYVlmfn+ZnZ+29FydVrm+wswxCGOs8AMc9xHwTrAI05y4Cv2i6Qn9EtIBFTJKfAab/gJqmuQEnCGMaJKBCTeOe7SoQRMMUAP74VqHeABpxHwlcvdCSXXAb7RjYBFTtzdArDEKq5s4QYX2MPnPy3c4jIC0uwnWz7iqPLEpjFe4aPJGKuqSyO94KCJkarY5ImjvNPdc96r2W9yYuO/1fo3/gJ90S0RrD3WIQAAAABJRU5ErkJggg==" />',
						"events": {
							"click": () => {
								if (blackAndWhite.innerHTML === '开启黑白效果') {
									blackAndWhite.innerHTML = '关闭黑白效果';
									this.catCesium.openBlackAndWhite(true);
								} else {
									blackAndWhite.innerHTML = '开启黑白效果';
									this.catCesium.openBlackAndWhite(false);
								}
							}
						}
					},
					{
						"text": "开启马赛克效果",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKFJREFUOE/t0yEOwkAQRuGvSDQWhQAcCRdAcAI0J8FzEjRnaBUKgSLBNcFiQQJZUlHRaUUtfzLJJvP2ZbO7kyHHSpwiaI0xyfBp2ZxaiYlS9hUUf4G87x38BCesMa/VrLZufeUkuGARUNdKFEqS4IZpQByxaTtCEtyRvmVT9th1CR4YBdAWhy7BC8MAWuLcJXhjEEBJ/OwSpGksq2piW0f9C8soICZeXuC2AAAAAElFTkSuQmCC" />',
						"events": {
							"click": () => {
								if (mosaic.innerHTML === '开启马赛克效果') {
									mosaic.innerHTML = '关闭马赛克效果';
									this.catCesium.openMosaic(true);
								} else {
									mosaic.innerHTML = '开启马赛克效果';
									this.catCesium.openMosaic(false);
								}
							}
						}
					},
					{
						"text": "开启景深效果",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMRJREFUOE/tkzEOgyAUhv/nkTTuegQ3uQaxe127eAz0FNDZaOgZnJ2cCU2blGoDqU07lukFHl9+/vdD+HJR6P4wDCcAh9A5Eak4jvMgYBxHaYw5A1A+SBRFMkkSegtI0/T4Cuj7PvstgDEmAWQ7/VSc83qjgDFmrbX5GlAURbMsy2WeZ73e11o3nPPcC2jb1hnmm8I0Tei6DlVVYTOFh4I1wPecsiwzIpJCCGf+vfgDnh7syUHIxI+CJIRwmQn+hT1qbj1XEyScEeXC0rwAAAAASUVORK5CYII=" />',
						"events": {
							"click": () => {
								if (depthOfField.innerHTML === '开启景深效果') {
									depthOfField.innerHTML = '关闭景深效果';
									this.catCesium.openDepthOfField(true);
								} else {
									depthOfField.innerHTML = '开启景深效果';
									this.catCesium.openDepthOfField(false);
								}
							}
						}
					},
					{
						"text": "开启辉光效果",
						"icon": '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAOhJREFUOE+lk40NAUEQhd91oANKoAMl6AAVoIKjAjpAB0q4DiiBDpQgn8zIZnfnSEwyuVx25+X9zDbqr4Ek+h5da74ATO28+xVgIeki6WkDY/ve7AubmaSTA+YMGFhLAojKARg8SHJARRIcCAlD82ApqZBSAxhJ2tpQm2hH1iQ3tAbgw8eKcTsD/xw5AFRpKGLSKnD9bAb63a7GABP3AcDGTCwYpPeJCpcxL62HpeIRv89qDJDA5l0zAAzEYPYkZOAZkzc9t5toZzdojzhk4Oikka4y/0X1vYW/AdI0ivyjt5BTzN9CIeEFd78tEQqEpnoAAAAASUVORK5CYII=" />',
						"events": {
							"click": () => {
								if (brightness.innerHTML === '开启辉光效果') {
									brightness.innerHTML = '关闭辉光效果';
									this.catCesium.openBloom(true);
								} else {
									brightness.innerHTML = '开启辉光效果';
									this.catCesium.openBloom(false);
								}
							}
						}
					},
				]
			}
		];

		let menu: Menu = new Menu(list, {});
		let menuDom: HTMLElement = document.getElementById('cm_0') as HTMLElement;
		this.catCesium.init(menu);

		let roundLook: Element = menuDom.children[0].children[2].children[3].children[0].children[1];
		let closeTerrain: Element = menuDom.children[0].children[3].children[3].children[0].children[1];
		let closeTriangle: Element = menuDom.children[0].children[3].children[3].children[1].children[1];
		let openTerOpc: Element = menuDom.children[0].children[3].children[3].children[2].children[1];
		let terrTest: Element = menuDom.children[0].children[4].children[3].children[0].children[1];
		let closeAtmo: Element = menuDom.children[0].children[4].children[3].children[1].children[1];
		let openSun: Element = menuDom.children[0].children[4].children[3].children[2].children[1];
		let nightVision: Element = menuDom.children[0].children[5].children[3].children[0].children[1];
		let blackAndWhite: Element = menuDom.children[0].children[5].children[3].children[1].children[1];
		let mosaic: Element = menuDom.children[0].children[5].children[3].children[2].children[1];
		let depthOfField: Element = menuDom.children[0].children[5].children[3].children[3].children[1];
		let brightness: Element = menuDom.children[0].children[5].children[3].children[4].children[1];
	};

	public destroy(): void {

	}
};



