# 坐标系与变换（position / rotation / scale）

本章主要讲坐标系和变换



## 本节目标 {#this-chapter-goal}

- 搞清楚 three.js 的世界坐标轴：`x / y / z` 分别代表什么方向
- 学会用三大变换属性控制物体：`position`（位置）、`rotation`（旋转）、`scale`（缩放）
- 能通过键盘控制一个物体移动、旋转、缩放（形成肌肉记忆）



## 思维模型 {#mind-model}

- **x 轴**：左右（+x 向右，-x 向左）
- **y 轴**：上下（+y 向上，-y 向下）
- **z 轴**：前后（在默认相机设置里，通常把相机放在 +z 方向往原点看；物体 z 变小会更靠近相机）

> [!info]
>
> 你可以先记一个口诀：**右（x）、上（y）、前后（z）**。



## 本节案例 {#this-chapter-case}

> [!tip]
>
> 代码在下方 `html` 中实现，键盘控制立方体（移动 / 旋转 / 缩放）。

键位约定（固定练习用）：

- **移动**：`W/A/S/D`（前/左/后/右）
- **上下**：`Q/E`（下/上）
- **旋转**：方向键 `←/→` 绕 y 轴；`↑/↓` 绕 x 轴
- **缩放**：`Z` 缩小，`X` 放大
- **重置**：`R`



## 本课涉及的核心 API 说明 {#this-chapter-API-explain}

- **`mesh.position`（`THREE.Vector3`）**
  - 作用：控制物体的位置。
  - 常用：`mesh.position.x/y/z = ...` 或 `mesh.position.set(x, y, z)`。
- **`mesh.rotation`（`THREE.Euler`）**
  - 作用：控制物体绕 x/y/z 轴旋转的角度。
  - 重要：单位是**弧度**，不是度数。
  - 常用：`mesh.rotation.y += 0.02`。
  - 换算：( \pi \approx 3.14159 )，(180^\circ = \pi)。
- **`mesh.scale`（`THREE.Vector3`）**
  - 作用：控制物体在 x/y/z 轴的缩放倍数。
  - 常用：`mesh.scale.set(1, 2, 1)`（把 y 方向拉高 2 倍）。
- **`THREE.AxesHelper(size)`**
  - 作用：显示坐标轴辅助线，帮助建立方向感。
  - 约定颜色（常见习惯）：X 红、Y 绿、Z 蓝。
- **`window.addEventListener('keydown', handler)`**
  - 作用：监听键盘按下事件，用来做交互控制。



## 课后练习 {#homework}

1. 把移动速度从 `0.1` 改成 `0.02`，感受更精细的控制
2. 把旋转速度从 `0.05` 改成 `Math.PI / 180`（每次按键转 1 度）
3. 把缩放限制做得更合理（比如不允许小于 0.2，不允许大于 5）



## 自测问题 {#self-testing}

- 为什么 `rotation` 用的是弧度？`Math.PI` 大概等于多少度？

  ```
  因为弧度是计算机图形学和数学中的标准单位
  	数学上的自然单位：弧度是基于圆周率 π 定义的，与三角函数（sin、cos 等）天然兼容
      避免频繁转换：GPU 和底层图形库（WebGL/OpenGL）都使用弧度，直接传入无需转换
      精度更高：弧度是连续值，角度制存在整数/浮点转换损耗
      微积分友好：导数公式简洁（d(sin x)/dx = cos x 仅在弧度制下成立）
      
  // 核心转换公式
  弧度 = 角度 × (Math.PI / 180)
  角度 = 弧度 × (180 / Math.PI)
  
  // 常用值
  Math.PI = 180度
  Math.PI / 2 = 90度
  Math.PI / 3 = 60度
  Math.PI / 4 = 45度
  Math.PI / 6 = 30度
  Math.PI * 2 = 360度（一圈）
  ```
  
- `position.z` 变大时，物体是更靠近还是更远离相机（在默认相机放在 z=5 的情况下）？

  ```
  position.z 变大时，物体更远离相机。
  
  Three.js 使用右手坐标系：
      相机默认朝向 -Z 轴（看向原点）
      相机位置：(0, 0, 5)
      物体越往 +Z 方向移动，离相机越远
  ```
  
- `scale.set(2, 1, 1)` 会让物体发生什么变化？

  ```
  物体在 X 轴方向上拉伸为原来的 2 倍，Y 轴和 Z 轴保持不变。
  ```




## 本节代码 {#code}

```html
<!doctype html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Lesson 02 - Transforms (position/rotation/scale)</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
    }

    /* 这一层用于显示键位提示，方便你边玩边学 */
    .hud {
      position: fixed;
      left: 12px;
      top: 12px;
      padding: 10px 12px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      border-radius: 8px;
      line-height: 1.5;
      font-size: 13px;
      user-select: none;
      max-width: 420px;
    }

    .hud kbd {
      display: inline-block;
      padding: 1px 6px;
      margin: 0 2px;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-bottom-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <!-- HUD：键位提示（不影响 three.js 渲染） -->
  <div class="hud">
    <div><strong>第 2 课：坐标系与变换</strong></div>
    <div>移动：<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>（前/左/后/右）</div>
    <div>上下：<kbd>Q</kbd>/<kbd>E</kbd>（下/上）</div>
    <div>旋转：方向键 <kbd>←</kbd><kbd>→</kbd>（绕 y 轴） <kbd>↑</kbd><kbd>↓</kbd>（绕 x 轴）</div>
    <div>缩放：<kbd>Z</kbd> 缩小，<kbd>X</kbd> 放大；重置：<kbd>R</kbd></div>
  </div>

  <!-- 引入 three.js 核心库（从 CDN 加载），引入后全局会有 THREE 这个对象可用 -->
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>

  <script>
    // 1) 场景（舞台）：所有物体都要放进来
    const scene = new THREE.Scene();

    // 2) 相机（眼睛）：从哪里看场景
    const camera = new THREE.PerspectiveCamera(
      75, // 视野角度
      window.innerWidth / window.innerHeight, // 宽高比
      0.1, // 近裁剪面
      1000, // 远裁剪面
    );
    camera.position.set(0, 0, 5); // 相机放到 z=5，朝向默认看向场景中心附近

    // 3) 渲染器（画图机器）：负责把画面画到 canvas 上
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4) 坐标轴辅助线：帮你建立 x/y/z 的方向感
    const axes = new THREE.AxesHelper(2.5);
    scene.add(axes);

    // 5) 创建一个立方体（形状 + 材质 -> Mesh）
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 6) 控制参数：把速度集中管理，方便你做练习时改数值
    const moveStep = 0.1; // 每次按键移动多少（单位：世界坐标）
    const rotateStep = 0.05; // 每次按键旋转多少（单位：弧度）
    const scaleStep = 0.1; // 每次按键缩放多少（倍数增量）
    const minScale = 0.2; // 最小缩放限制（避免缩成看不见或出现奇怪效果）
    const maxScale = 5; // 最大缩放限制（避免太大看不到全貌）

    // 7) 键盘交互：按键 -> 改变 cube 的 position/rotation/scale
    window.addEventListener("keydown", (event) => {
      // 统一把按键转成小写，避免大小写差异影响判断
      const key = event.key.toLowerCase();

      // 7.1 移动：改变 position
      if (key === "w") cube.position.z -= moveStep; // 向前（更靠近相机方向）
      if (key === "s") cube.position.z += moveStep; // 向后
      if (key === "a") cube.position.x -= moveStep; // 向左
      if (key === "d") cube.position.x += moveStep; // 向右
      if (key === "q") cube.position.y -= moveStep; // 向下
      if (key === "e") cube.position.y += moveStep; // 向上

      // 7.2 旋转：改变 rotation（注意：单位是弧度）
      if (event.key === "ArrowLeft") cube.rotation.y += rotateStep;
      if (event.key === "ArrowRight") cube.rotation.y -= rotateStep;
      if (event.key === "ArrowUp") cube.rotation.x += rotateStep;
      if (event.key === "ArrowDown") cube.rotation.x -= rotateStep;

      // 7.3 缩放：改变 scale（每个轴都一起缩放）
      if (key === "x") {
        const next = Math.min(maxScale, cube.scale.x + scaleStep);
        cube.scale.set(next, next, next);
      }
      if (key === "z") {
        const next = Math.max(minScale, cube.scale.x - scaleStep);
        cube.scale.set(next, next, next);
      }

      // 7.4 重置：回到初始状态
      if (key === "r") {
        cube.position.set(0, 0, 0);
        cube.rotation.set(0, 0, 0);
        cube.scale.set(1, 1, 1);
      }
    });

    // 8) 自适应：窗口变化时更新相机和渲染器（你第 6 课会更系统学它）
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 9) 动画循环：本课重点是“按键改变属性”，所以这里只需要持续渲染
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  </script>
</body>

</html>
```

