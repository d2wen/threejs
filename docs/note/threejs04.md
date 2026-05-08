# 几何体与材质基础（Geometry + Material = Mesh）

本章主要讲几何体与材质基础



## 本节目标 {#this-chapter-goal}

- 理解 three.js 中“物体为什么能被看到”：`Geometry`（形状）+ `Material`（外观）= `Mesh`（可渲染物体）
- 认识几类常见几何体：立方体、球体、圆环、平面
- 认识几类常见材质：`MeshBasicMaterial`、`MeshNormalMaterial`、`MeshStandardMaterial`
- 学会用代码快速切换几何体/材质，观察视觉差异



## 思维模型 {#mind-model}

> [!important] 注意
>
> **Geometry 决定“长什么形状”，Material 决定“看起来像什么”，Mesh 才是“真正放进 Scene 的东西”。**

类比：

- Geometry：泥胚/模型的形状
- Material：表面涂装（颜色、金属感、粗糙度、透明度）
- Mesh：做好的“成品道具”，可以摆上舞台让相机拍



## 本课涉及的核心 API 说明 {#this-chapter-API-explain}

- **`THREE.BoxGeometry(w, h, d)`**
  - 作用：创建立方体/长方体几何体。
  - 适合：入门、碰撞体、UI 方块。
- **`THREE.SphereGeometry(radius, widthSegments, heightSegments)`**
  - 作用：创建球体几何体。
  - 参数提示：`segments` 越大越圆滑，但性能开销越大。
- **`THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)`**
  - 作用：创建圆环（甜甜圈）几何体。
- **`THREE.PlaneGeometry(w, h)`**
  - 作用：创建平面几何体（常用于地面/墙面/背景面）。
- **`THREE.MeshBasicMaterial(options)`**
  - 作用：基础材质，不受灯光影响（颜色“稳定”）。
  - 常用：练习、调试、纯色 UI 效果。
- **`THREE.MeshNormalMaterial(options)`**
  - 作用：用法线方向着色（会出现彩虹色），常用于调试模型朝向与凹凸变化。
  - 特点：通常也不需要灯光就能看出立体感。
- **`THREE.MeshStandardMaterial(options)`**
  - 作用：基于物理的标准材质（PBR），会受灯光影响，更接近真实世界。
  - 常用参数：
    - `color`：基础颜色
    - `metalness`：金属度（0~1）
    - `roughness`：粗糙度（0~1）
- **`THREE.Mesh(geometry, material)`**
  - 作用：把几何体和材质组合成一个可渲染物体。
- **`mesh.geometry.dispose()` / `mesh.material.dispose()`**
  - 作用：释放 GPU 资源。
  - 场景：你在运行时频繁“替换几何体/材质”时，最好释放旧资源避免显存泄漏。



## 本节案例 {#this-chapter-case}

> [!tip]
>
> 代码在下方 `html` 中实现，按键切换“形状”和“材质”。

键位约定：

- **切换几何体**：`1` 立方体、`2` 球体、`3` 圆环、`4` 平面
- **切换材质**：`B` Basic、`N` Normal、`S` Standard
- **旋转开关**：空格 `Space`

你将观察到：

- 同一种几何体，不同材质“观感”完全不同
- `Standard` 材质必须配合灯光才更好看



## 课后练习 {#homework}

1. 给 `Standard` 材质增加一个 `metalness/roughness` 的按键调节（例如 `[` `]`）
2. 把平面旋转成“地面”（绕 x 轴旋转 (-\pi/2)）
3. 加一个 `GridHelper`，帮助你理解空间尺度



## 自测问题 {#self-testing}

- 为什么 `MeshStandardMaterial` 更“真实”？它相比 `MeshBasicMaterial` 多依赖什么？

  ```
  MeshStandardMaterial 更真实是因为它模拟了真实世界的光照物理规律，而 MeshBasicMaterial 只是简单地把颜色画出来，不响应任何光照。
  
  1. 依赖光源（最关键）
  2. 依赖物理参数（金属度/粗糙度）
  3. 依赖环境贴图（反射环境）
  ```
  
- “切换几何体/材质”时为什么要 `dispose()`？

  ```
  在切换几何体或材质时，dispose() 用于手动释放 GPU 内存。如果不调用，会造成内存泄漏，导致游戏越玩越卡，最终崩溃。
  ```
  
- `SphereGeometry` 的 segments 越大一定越好吗？为什么？

  ```
  segments 越大，模型越光滑，但性能开销也越大。需要在视觉效果和性能之间找到平衡点。
  ```




## 本节代码 {#code}

```html
<!doctype html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Lesson 04 - Geometry & Material</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
    }

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
      max-width: 520px;
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

    .hud code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
    }
  </style>
</head>

<body>
  <!-- HUD：键位提示 + 当前状态显示 -->
  <div class="hud" id="hud">
    <div><strong>第 4 课：Geometry + Material = Mesh</strong></div>
    <div>几何体：<kbd>1</kbd>立方体 <kbd>2</kbd>球体 <kbd>3</kbd>圆环 <kbd>4</kbd>平面</div>
    <div>材质：<kbd>B</kbd>Basic <kbd>N</kbd>Normal <kbd>S</kbd>Standard</div>
    <div>旋转：<kbd>Space</kbd> 开/关</div>
    <div id="status" style="margin-top:6px; opacity:.9;"></div>
  </div>

  <!-- 引入 three.js 核心库 -->
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>

  <script>
    // 1) 场景（舞台）
    const scene = new THREE.Scene();

    // 2) 相机（眼睛）
    const camera = new THREE.PerspectiveCamera(
      60, // 视野角度
      window.innerWidth / window.innerHeight, // 宽高比
      0.1, // 近裁剪面
      1000, // 远裁剪面
    );
    camera.position.set(0, 1.2, 5); // 抬高一点相机，方便看“立体感”

    // 3) 渲染器（画图机器）
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4) 光照（Standard 材质需要光才更像“真实物体”）
    // 4.1 环境光：让整体不至于太黑
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);
    // 4.2 平行光：像太阳一样从一个方向照过来，能产生明暗变化
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(3, 4, 2);
    scene.add(dir);

    // 5) 辅助工具：坐标轴，帮助你判断方向
    const axes = new THREE.AxesHelper(2.5);
    scene.add(axes);

    // 6) 当前“被展示的物体”
    // 我们会不断替换它的 geometry / material 来观察差异
    const mesh = new THREE.Mesh();
    scene.add(mesh);

    // 7) 几何体工厂：根据 key 生成不同 geometry
    function createGeometry(type) {
      if (type === "box") return new THREE.BoxGeometry(1.2, 1.2, 1.2);
      if (type === "sphere") return new THREE.SphereGeometry(0.85, 32, 16);
      if (type === "torus") return new THREE.TorusGeometry(0.8, 0.28, 16, 48);
      if (type === "plane") return new THREE.PlaneGeometry(2.2, 2.2);
      return new THREE.BoxGeometry(1, 1, 1);
    }

    // 8) 材质工厂：根据 key 生成不同 material
    function createMaterial(type) {
      if (type === "basic") {
        // Basic：不受灯光影响，颜色始终“稳定”
        return new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      }
      if (type === "normal") {
        // Normal：根据法线方向着色，用来观察模型朝向与曲面变化
        return new THREE.MeshNormalMaterial();
      }
      if (type === "standard") {
        // Standard：PBR 标准材质，受灯光影响，更像真实物体
        return new THREE.MeshStandardMaterial({
          color: 0xffaa00,
          metalness: 0.3,
          roughness: 0.35,
        });
      }
      return new THREE.MeshBasicMaterial({ color: 0xffffff });
    }

    // 9) 资源释放：替换 geometry/material 时，释放旧资源避免显存累积
    function safeDispose(oldGeometry, oldMaterial) {
      if (oldGeometry) oldGeometry.dispose();
      if (oldMaterial) oldMaterial.dispose();
    }

    // 10) 当前状态：默认展示立方体 + Basic
    let currentGeometryType = "box";
    let currentMaterialType = "basic";
    let autoRotate = true;

    // 11) 应用当前状态到 mesh（真正把 geometry/material 装上去）
    function applyMeshState() {
      const oldGeometry = mesh.geometry;
      const oldMaterial = mesh.material;

      // 11.1 换形状
      mesh.geometry = createGeometry(currentGeometryType);

      // 11.2 换外观
      mesh.material = createMaterial(currentMaterialType);

      // 11.3 如果是平面，为了更容易看见，我们让它“立起来”一点点
      // 你也可以把它改成地面：mesh.rotation.x = -Math.PI / 2（作为练习）
      if (currentGeometryType === "plane") {
        mesh.rotation.set(0, 0, 0);
        mesh.position.set(0, 0, 0);
      }

      // 11.4 释放旧资源
      safeDispose(oldGeometry, oldMaterial);

      updateStatusText();
    }

    // 12) HUD 状态显示：把当前几何体/材质显示出来
    function updateStatusText() {
      const status = document.getElementById("status");
      status.innerHTML =
        `当前几何体：<code>${currentGeometryType}</code> ｜ 当前材质：<code>${currentMaterialType}</code> ｜ 旋转：<code>${autoRotate ? "ON" : "OFF"}</code>`;
    }

    // 13) 键盘交互：按键切换 geometry / material / 旋转
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      // 13.1 切换几何体
      if (key === "1") currentGeometryType = "box";
      if (key === "2") currentGeometryType = "sphere";
      if (key === "3") currentGeometryType = "torus";
      if (key === "4") currentGeometryType = "plane";

      // 13.2 切换材质
      if (key === "b") currentMaterialType = "basic";
      if (key === "n") currentMaterialType = "normal";
      if (key === "s") currentMaterialType = "standard";

      // 13.3 旋转开关
      if (event.code === "Space") autoRotate = !autoRotate;

      applyMeshState();
    });

    // 14) 自适应：窗口变化时更新相机与渲染器
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 15) 动画循环：如果开启 autoRotate，就每帧让物体转一点
    function animate() {
      requestAnimationFrame(animate);

      if (autoRotate) {
        mesh.rotation.y += 0.01;
        mesh.rotation.x += 0.005;
      }

      renderer.render(scene, camera);
    }

    // 16) 初始化：先应用一次状态，再启动渲染
    applyMeshState();
    animate();
  </script>
</body>

</html>
```

