# Three.js 避坑指南

Three.js 避坑指南：为什么你的 3D 场景跑不动？



## 光照 {#light}

### 各种光所消耗的性能 {#light-consumption-performance}

| 光照类型 | **API**          | **性能消耗(无阴影)** | **性能消耗(阴影)** | **特性描述**                                                 | **使用频率** |
| :------: | :--------------- | :------------------- | :----------------- | :----------------------------------------------------------- | :----------- |
|  环境光  | AmbientLight     | 极低                 | 不支持             | 你可以将环境光粗略理解为每个模型都自发光，模型的每一个地方的光照强度都相同 | 常用         |
|   点光   | PointLight       | 中                   | 高                 | 一个发光的点，会像四周发射光线，一个模型越接近这个点的面越亮 | 常用         |
|   线光   | DirectionalLight | 中                   | 中 / 高            | 你可以理解为单面的点光，只能对一个方向进行照射               | 常用         |
|  半圆光  | HemisphereLight  | 低                   | 不支持             | 具有两种颜色，在物体的上方和下方以不同颜色呈现               | 一般         |
|  矩形光  | RectAreaLight    | 高                   | 不支持             | 矩形光，就是生活中的那些摄影灯，正方形或者长方形             | 不常用       |
|  聚光灯  | SpotLight        | 高                   | 高                 | 聚光灯，你也可以理解为生活中的聚光灯                         | 不常用       |



### 光照烘培 {#light-baking}

当你的场景是静态场景时，你可以考虑将场景进行烘培渲染，也就是把光影等内容也一同渲染到材质中，这样你就不需要通过 Three 去生成光照，从而降低性能损耗



## 纹理材质 {#texture-material}

### 精灵图 {#sprite-sheet}

精灵图是 **SpriteMaterial(精灵材质)** 和 **Sprite(精灵模型)** 的称呼，Sprite 你可以理解为一张只有两个三角形组成的贴图，具有极少的顶点数。通过结合 LOD 或 四 / 八叉树，将远处的模型，从而提高性能。



## 模型方面 {#model-aspect}

### 模型的单双面渲染 {#model-render}

在前面我们知道，在模型的 material 中我们可以通过设置 material.side = Three.DoubleSide 去设置双面的渲染，虽然这种渲染可以看到更丰富的模型，但也会带来多余的渲染性能消耗，因此，当你不是必须开启双面渲染时，建议不要去设置。



### dispose {#dospose}

在 Three 中，当你定义了一些对象，例如: 几何体，材质，纹理，那么在你渲染进页面中，想删除这个对象，你不能只是从 Scene 中移除，因为这种方法仍然会使得其被 GPU 显存所使用，从而导致性能的浪费，因此你需要手动的 dispose 一下。

```js
// 使用方法
materialObj.dispose()
textureObj.dispose()
geomertyObj.dispose()
```



### 对象的复用 {#object-reuse}

对象的复用主要是 Mesh / Geometry / Material 这三个，例如我们需要创建多个 Mesh ，我们需要开启一个 For 循环去循环创建，此时我们便可以将 **共享的 Geometry 和 Material 提取到循环外部**，在循环内部只创建不同的 Mesh 并引用它们。

```js
// ✅ 正确做法：复用 Geometry 和 Material
const sharedGeometry = new THREE.BoxGeometry(1, 1, 1);
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(sharedGeometry, sharedMaterial);
    mesh.position.x = i * 1.2;
    scene.add(mesh);
}
```



### 模型过多 {#excessive-models}

#### 模型完全相同

InstanceMesh

#### 模型相同，但材质等不同

InstanceMesh 再加上移动纹理贴图

#### 模型不同，但保持静态

你可以通过将静态模型一起合并到一个模型中，产出一个巨大的 Mesh ，从而将原先一个一个的 draw call 变成，主要的材质模型的 draw call ，从而提高性能

```js
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const geometries = [];
objects.forEach(obj => {
    obj.geometry.applyMatrix4(obj.matrixWorld); 
    geometries.push(obj.geometry);
});

// 将模型合并为一个
const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
const mergedMesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mergedMesh);
```

#### 终极方案

#### LOD

LOD 的原理是，根据模型离摄像机的距离来进行模型精度的切换，例如: 远的模型使用低精度(可能只有几个顶点），近的使用高精度(几千或上万个顶点）。此方法在 Three 中有内置。

#### 四叉/八叉 树

这两个树分别对应 2D 和 3D 状态下，你可以理解为将你的场景具体切分成多个区域，然后根据你当前看到的区域进行渲染。







