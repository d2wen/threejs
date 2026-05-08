# Three.js 世界观（Scene / Camera / Renderer）

从这里开始将带你了解什么是 three.js



## 本节目标 {#this-chapter-goal}

- 理解 three.js 中最核心的三要素：`scene`、`camera`、`renderer`
- 知道“3D 世界是如何被画到屏幕上的”
- 能用自己的话描述：这段最小代码在做什么



## 思维模型 {#mind-model}

- **Scene（场景）**：拍电影的舞台，所有 3D 物体都放在这里
- **Camera（相机）**：摄影机，从某个位置和角度看舞台
- **Renderer（渲染器）**：画图机器，把相机看到的画面画到屏幕上的画布

要点：

- 没有 Scene：物体无处摆放
- 没有 Camera：没有视角，画不出画面
- 没有 Renderer：就算算出了画面，也上不了屏幕



## 本节案例 {#this-chapter-case}

> [!tip]
>
> 代码在下方 `html` 中实现，以简单自转立方体为例。

核心步骤：

1. 创建 `scene`
2. 创建 `camera` 并设置位置
3. 创建 `renderer` 并设置大小，挂到 `document.body`
4. 创建立方体：`BoxGeometry + MeshBasicMaterial -> Mesh`
5. 把立方体添加进 `scene`
6. 写 `animate()` 动画循环：更新旋转 + `renderer.render(scene, camera)`



## 本课涉及的核心 API 说明 {#this-chapter-API-explain}

- **`THREE.Scene()`**
  - 作用：创建一个 3D 场景容器，所有物体、灯光等都要添加到这里。
  - 形象理解：拍电影的舞台本身。
- **`THREE.PerspectiveCamera(fov, aspect, near, far)`**
  - 作用：创建一个透视相机（符合人眼感觉的视角）。
  - 参数含义：
    - `fov`：垂直视野角度（Field of View），单位度数，数值越大视角越“广”，但变形越明显。
    - `aspect`：宽高比，一般用 `canvasWidth / canvasHeight` 或 `window.innerWidth / window.innerHeight`。
    - `near`：近裁剪面，距离相机多近开始能看见物体。
    - `far`：远裁剪面，距离相机多远之后就看不见物体。
  - 形象理解：拿在手里的摄影机，以及它的镜头参数。
- **`THREE.WebGLRenderer()`**
  - 作用：创建 WebGL 渲染器，负责调用 GPU 把 3D 场景画到屏幕。
  - 常用方法：
    - `setSize(width, height)`：设置渲染区域大小。
    - `render(scene, camera)`：用指定相机把指定场景渲染到画布。
  - 形象理解：专业的“画图机器”。
- **`THREE.BoxGeometry(width, height, depth)`**
  - 作用：创建一个长方体/立方体的几何形状。
  - 参数：宽、高、深，单位是 three.js 世界坐标单位。
  - 形象理解：一个只有“骨架”的方块，还没有外观。
- **`THREE.MeshBasicMaterial(options)`**
  - 作用：创建基础材质，不参与光照计算（始终是指定颜色，看不到真正光影）。
  - 常用选项：
    - `color`：颜色，可以用 16 进制写法例如 `0x00ff00`。
  - 形象理解：给物体涂上一层纯色油漆，不管灯光如何都很“稳定”。
- **`THREE.Mesh(geometry, material)`**
  - 作用：把“形状”和“材质”组合成一个真正可见的 3D 物体。
  - 常见属性：
    - `position`：位置（x, y, z）。
    - `rotation`：旋转（x, y, z，单位弧度）。
    - `scale`：缩放（x, y, z）。
  - 形象理解：已经上好颜色、可以摆到舞台上的道具。
- **`scene.add(object)`**
  - 作用：把一个 3D 对象添加到场景中。
  - 形象理解：把道具搬上舞台，否则相机拍不到。
- **`requestAnimationFrame(callback)`**
  - 作用：告诉浏览器“下一帧刷新之前请再调用一次这个函数”，用来实现平滑动画。
  - 特点：
    - 根据屏幕刷新率自动调整调用频率（一般 60 次/秒）。
    - 页面不可见（切到后台标签页）时会自动降频或暂停，省电。
  - 形象理解：浏览器在每一帧动画前都会喊你一声：“现在可以更新画面了！”



## 课后练习建议 {#homework}

1. 改变立方体颜色（修改 `color`）
2. 改变相机距离（修改 `camera.position.z`）
3. 改变旋转速度（修改 `rotation` 增量）



## 知识点自测问题 {#self-testing}

- 你能不能用一句话解释 `scene`、`camera`、`renderer` 分别是什么？

  ```
  scene（场景） 是存放所有 3D 物体的容器，
  camera（相机） 决定了从哪个角度观察场景，
  renderer（渲染器） 负责把相机看到的画面绘制到屏幕上。
  ```

- 为什么需要在每一帧都调用 `renderer.render(scene, camera)`？

  ```
  3D 场景需要持续更新和重绘
  如果不在每一帧调用 renderer.render()，即使物体的属性改变了，屏幕上也不会显示任何变化——画面会静止在最后一帧的状态。
  总结：
    动态场景（有动画、交互、粒子效果等）：必须每帧渲染
    完全静态场景：可以只在初始化时渲染一次，或采用按需渲染策略
  ```

- 如果不调用 `requestAnimationFrame(animate)` 会发生什么？

  ```
  动画只会执行第一帧就彻底停止，画面定格在初始状态。 
  ```




## 本节代码 {#code}

```html
<!doctype html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Lesson 01 - Three.js World Overview</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }
  </style>
</head>

<body>
  <!-- 引入 three.js 核心库（从 CDN 加载），引入后全局会有 THREE 这个对象可用 -->
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
  <script>
    // 1. 创建场景（舞台）：用于承载所有 3D 物体、灯光等元素
    const scene = new THREE.Scene();

    // 2. 创建相机（眼睛）：决定从哪里、以多大视角去看这个场景
    const camera = new THREE.PerspectiveCamera(
      75, // 垂直视野角度（越大视角越广，畸变越明显）
      window.innerWidth / window.innerHeight, // 画面宽高比，防止画面被拉伸
      0.1, // 最近能看到多近（小于这个距离的东西会被裁掉）
      1000, // 最远能看到多远（超过这个距离的东西会被裁掉）
    );
    // 把相机沿着 z 轴向后移动 5 个单位，这样才能完整看到场景中心的立方体
    camera.position.z = 5;

    // 3. 创建渲染器（画图机器）：负责把 3D 场景“画”到浏览器里的一块画布上
    const renderer = new THREE.WebGLRenderer();
    // 设置画布的大小为当前窗口大小（单位：像素）
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 把渲染器内部生成的 canvas 元素插入到页面中，这样你才能看见画面
    document.body.appendChild(renderer.domElement);

    // 4. 创建立方体（形状 + 材质 -> 网格 Mesh）
    // 4.1 创建几何体：一个 1x1x1 的立方体（只是形状，没有颜色和材质）
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 4.2 创建材质：基础材质，不受灯光影响，这里设置为绿色
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // 4.3 创建网格：把“形状”和“材质”组合成一个真正可以出现在场景中的 3D 物体
    const cube = new THREE.Mesh(geometry, material);
    // 4.4 把立方体添加到场景中，否则相机渲染时不会看到它
    scene.add(cube);

    // 5. 动画循环：让立方体持续旋转，并在每一帧都重新渲染画面
    function animate() {
      // 告诉浏览器：在下一次重绘前再次调用 animate，实现循环
      requestAnimationFrame(animate);

      // 在每一帧里，稍微改变立方体的旋转角度，形成“转动”的效果
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // 使用当前相机视角，把当前场景画到屏幕上的画布里
      renderer.render(scene, camera);
    }

    // 调用一次 animate，启动整个动画循环
    animate();
  </script>
</body>

</html>
```

