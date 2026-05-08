# 动画循环与时间（requestAnimationFrame）

本章主要讲动画循环与时间



## 本节目标 {#this-chapter-goal}

- 理解 three.js 中动画是如何“每一帧”刷新的
- 搞清楚 `requestAnimationFrame` 和简单定时器（`setInterval`）的区别
- 会写两种动画：固定速度动画、跟时间相关（帧率无关）的动画



## 思维模型 {#mind-model}

- 屏幕每秒会刷新很多次（常见是 60 帧/秒）
- 每一帧刷新时，我们有一次机会：
  1. 更新场景里物体的状态（位置、旋转、缩放等）
  2. 调用 `renderer.render(scene, camera)` 把当前状态画出来
- `requestAnimationFrame` 就是浏览器在每一帧之前喊你：“现在可以更新并画下一帧了！”



## 本课涉及的核心 API 说明 {#this-chapter-API-explain}

- **`requestAnimationFrame(callback)`**
  - 作用：在下一帧重绘之前调用 `callback`，通常用于创建动画循环。
  - 特点：
    1. 频率一般与显示器刷新率一致（常见是 60 次/秒）
    2. 页面不活跃时自动降低频率或暂停，有利于省电和性能
  - 常见用法：
    1. 在 `callback` 函数内部再次调用 `requestAnimationFrame(callback)`，形成循环。
- **`performance.now()`**
  - 作用：返回从页面加载到现在经历的毫秒数（高精度时间）。
  - 用途：计算“本帧距离上一帧经过了多少毫秒”（即 `deltaTime`）。



## 本节案例 {#this-chapter-case}

> [!tip]
>
> 代码在下方 `html` 中实现，两种动画速度写法。

场景设置：

- 两个立方体并排放置：
  - 左边：使用“固定增量”动画写法（`rotation.y += 0.02`）
  - 右边：使用“基于时间”的写法（`rotation.y += speed * deltaSeconds`）
- 你可以通过调整浏览器性能（例如开很多标签）或修改代码中的速度参数，观察两者的差异。



## 固定增量 vs 基于时间 {#fix-vs-time}

- **固定增量写法**（帧率相关）：
  - 每一帧都加同样的旋转值。
  - 帧率高时转得更快，帧率低时转得更慢。
  - 写法简单，适合入门练习。
- **基于时间写法**（帧率无关）：
  - 不关心“第几帧”，而是看“过去了多少秒”。
  - 不管是 30 帧/秒还是 60 帧/秒，总旋转角度基本一致。
  - 写法稍复杂，但推荐用于真实项目。



## 课后练习 {#homework}

1. 把“基于时间”的立方体从旋转改成左右来回移动（像在做匀速运动）
2. 尝试把两种写法的速度调整到看起来“差不多”，观察在浏览器卡顿时谁更稳定。
3. 在动画循环中加入 `console.log(deltaSeconds)`，观察在不同电脑状态下的变化。



## 自测问题 {#self-testing}

- 为什么在动画函数内部要再次调用 `requestAnimationFrame`？

  ```
  在动画函数内部再次调用 requestAnimationFrame 是为了创建持续不断的动画循环，实现每一帧的连续更新。
  ```
  
- 如果不用 `requestAnimationFrame`，而只用 `setInterval`，可能会出现什么问题？

  ```
  1. 无法同步显示器刷新率（最严重）
  2. 标签页后台时依然运行（浪费性能）
  3. 时间不精确，导致掉帧/跳帧
  4. 动画撕裂和抖动
  5. 多个动画难以同步
  6. 内存泄漏风险（忘记清除）
  ```
  
- 什么是 `deltaTime`？为什么可以用它让动画“跟帧率无关”？

  ```
  deltaTime 是上一帧到当前帧所经过的时间（单位：秒或毫秒），即两帧之间的时间间隔。
  deltaTime 让动画的速度基于真实时间而非帧数，确保在不同刷新率的显示器上，物体移动、旋转、缩放的速度完全一致。
  ```




## 本节代码 {#code}

```html
<!doctype html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Lesson 03 - Animation Loop & Time</title>
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
      max-width: 460px;
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
  <!-- HUD：文本提示，说明左/右立方体分别代表哪种动画写法 -->
  <div class="hud">
    <div><strong>第 3 课：动画循环与时间</strong></div>
    <div>左侧立方体：固定增量动画（每帧 <code>+0.02</code>）</div>
    <div>右侧立方体：基于时间的动画（每秒旋转一定角度，跟帧率无关）</div>
    <div>你可以尝试让电脑忙一点（开多个标签页），观察两者速度变化。</div>
  </div>

  <!-- 引入 three.js 核心库 -->
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>

  <script>
    // 1) 场景：所有物体都会放进来
    const scene = new THREE.Scene();

    // 2) 相机：从正前方向场景中心看
    const camera = new THREE.PerspectiveCamera(
      75, // 垂直视野角度
      window.innerWidth / window.innerHeight, // 宽高比
      0.1, // 近裁剪面
      1000, // 远裁剪面
    );
    camera.position.set(0, 0, 6); // 相机稍微远一点，方便同时看到两个立方体

    // 3) 渲染器：负责把画面画到 canvas 上
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4) 灯光辅助（虽然本课不是讲灯光，但加一点环境光让对比更清晰）
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    // 5) 创建两个立方体：左侧（固定增量）和右侧（基于时间）

    // 5.1 左侧立方体：使用“固定增量”写法
    const leftGeometry = new THREE.BoxGeometry(1, 1, 1);
    const leftMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const leftCube = new THREE.Mesh(leftGeometry, leftMaterial);
    leftCube.position.x = -1.8; // 往左移一点
    scene.add(leftCube);

    // 5.2 右侧立方体：使用“基于时间”的写法
    const rightGeometry = new THREE.BoxGeometry(1, 1, 1);
    const rightMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const rightCube = new THREE.Mesh(rightGeometry, rightMaterial);
    rightCube.position.x = 1.8; // 往右移一点
    scene.add(rightCube);

    // 6) 准备时间相关的变量，用于计算“每一帧过去了多少秒”
    let lastTime = performance.now(); // 上一帧的时间戳（毫秒）

    // 给右侧立方体设置一个“每秒旋转多少弧度”的速度
    const rightCubeAngularSpeed = Math.PI; // 每秒旋转 π 弧度（180 度）

    // 7) 动画循环：在这里更新两个立方体的状态并渲染
    function animate() {
      // 在本帧结束前，浏览器会再次调用 animate（形成循环）
      requestAnimationFrame(animate);

      // 7.1 固定增量动画：左侧立方体
      // 不考虑真实时间，每一帧都增加同样的旋转值
      leftCube.rotation.y += 0.02;

      // 7.2 基于时间的动画：右侧立方体
      // 1）先拿到当前时间（单位：毫秒）
      const now = performance.now();
      // 2）计算距离上一帧过去了多少毫秒
      const deltaMs = now - lastTime;
      // 3）把毫秒转成秒（更直观），例如 16.7ms ≈ 0.0167 秒
      const deltaSeconds = deltaMs / 1000;
      // 4）根据“每秒旋转多少弧度” * “过去了多少秒” 来计算本帧需要旋转多少
      rightCube.rotation.y += rightCubeAngularSpeed * deltaSeconds;
      // 5）更新 lastTime，准备给下一帧使用
      lastTime = now;

      // 7.3 把当前场景状态画到屏幕上
      renderer.render(scene, camera);
    }

    // 8) 窗口自适应：当浏览器窗口大小变化时，更新相机和渲染器
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 9) 启动动画循环
    animate();
  </script>
</body>

</html>
```

