"use strict";


var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      // console.log(descriptor);
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {  // instanceof 运算符用来检测 Constructor.prototype 是否存在于参数 instance 的原型链上。
    throw new TypeError("Cannot call a class as a function");
  }
}

var internals = {};
internals.W = 500;
internals.H = 500;

// 生成 min-max 之间的随机数
internals.randomIntFromInterval = function (min, max) {
  return (
    Math.floor(Math.random() * (max - min + 1) + min)
  );
};
// 设置材质
internals.materials = {
  //MeshPhongMaterial表面有光泽
  orange: new THREE.MeshPhongMaterial({ color: 0xB7513C, flatShading: true }),
  green: new THREE.MeshPhongMaterial({ color: 0x379351, flatShading: true }),
  brown: new THREE.MeshPhongMaterial({ color: 0x5C2C22, flatShading: true }),
  pink: new THREE.MeshPhongMaterial({ color: 0xB1325E, flatShading: true }),
  gray: new THREE.MeshPhongMaterial({ color: 0x666666, flatShading: true }),
  fish: new THREE.MeshPhongMaterial({ color: 0xFF7F50, flatShading: true }),
  rabbit: new THREE.MeshPhongMaterial({ color: 0xF59CBC, flatShading: true }),
  black: new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: true }),
  blue: new THREE.MeshPhongMaterial({ color: 0x20499D, flatShading: true }),
  white: new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
  submarine: new THREE.MeshPhongMaterial({ color: 0xDBCC02, flatShading: true }) };
  
//  对group里面的对象分别判断设置阴影支持
internals.shadowSupport = function (group) {
  group.traverse(function (object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;  // 开启“引起阴影”
      object.receiveShadow = true;  // 开启“接收阴影”
    }
  });
};

 
 
// var hexcolor = document.body.getElementById("objcolor").value.substring(1); //将颜色的16进制数从第一位开始读取 去除#号
// console.log('hex::',hexcolor);

var Fish = function () {
  function Fish(config) {
    _classCallCheck(this, Fish);

    this.mesh = new THREE.Group();

    var fish = this._createFish();

    this.mesh.position.x = 200;
    this.mesh.position.y = config.y || Math.random();
    this.mesh.position.z = config.z || 0;

    this.mesh.add(fish);

    this.animate(config);
  }
 
  _createClass(Fish, [
      { key: 'animate', 
        value: function animate(config) {
          var _this = this;
          

          TweenMax.to(this.mesh.position, 3.5, {
            x: -50,
            repeat: Infinity,
            delay: config.delay || 0,
            onRepeat: function onRepeat() {

              _this.mesh.position.y = internals.randomIntFromInterval(-10, 20);
            } });

        } 
      },
      { key: '_createFish', 
        value: function _createFish(){
          var group = new THREE.Group();
   
          var eyeGeo = new THREE.CubeGeometry(0.5, 1, 0.5);
          var eye = new THREE.Mesh(eyeGeo, internals.materials.gray);
          eye.position.set(-2.5, 0.5, -2.5);
          this.eye = eye;

          var eyeb = eye.clone();
          eyeb.position.z = eye.position.z * -1;
          this.eyeb = eyeb;

          var fishGeo = new THREE.SphereGeometry(5, 4, 6);
          var fish = new THREE.Mesh(fishGeo, internals.materials.fish);


          fish.scale.set(1, 0.8, 1); //沿着XYZ分别缩放1倍/0.8倍/1倍

          var fish2 = fish.clone();

          fish2.scale.set(.55, .25, .75);
          fish2.position.set(5, -1.5, -0.5);//将模型中心移动到5,-1.5,2的位置

          //var fish3 = fish.clone();
          //fish3.scale.set(.1, 1, 1);
          //fish3.position.set(-5.5, -2, -1);

          group.add(fish);
          group.add(fish2);
          group.add(eye);
          group.add(eyeb);

          internals.shadowSupport(group);

          return group;
        } 
      }
    ]
  );
  return Fish;
}();

// 创建潜艇
var Submarine = function () {
  function Submarine() {
    _classCallCheck(this, Submarine);
    this.mesh = new THREE.Group();

    this.body = this._createBody();   // 身体
    this.wings = this._createWings(); // 翼
    this.paddles = this._createPaddles(); // 船桨


    // rotateOnAxis（按从原点到任意方向的向量进行旋转）
    this.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);

    this.mesh.add(this.body);
    this.mesh.add(this.wings);
    this.mesh.add(this.paddles);
 

    this.animate();
  }
  _createClass(Submarine, [
    { 
      key: 'animate', 
      value: function animate(){
        TweenMax.to(this.mesh.position, 1, {
          x: -2,
          y: 4,
          repeat: Infinity,
          yoyo: true,
          ease: Sine.easeInOut }
        );
        TweenMax.to(this.mesh.rotation, 1, {
          x: -1.7,
          repeat: Infinity,
          yoyo: true,
          ease: Sine.easeInOut }
        );
        TweenMax.to(this.paddles.rotation, 0.1, {
          y: Math.PI,
          repeat: Infinity,
          ease: Power0.easeNone }
        );
        TweenMax.to(this.eye.scale, 0.5, {
          z: 0.1,
          // y: 0.5,
          repeat: Infinity,
          yoyo: true,
          delay: 5,
          repeatDelay: 3 
        });
        TweenMax.to(this.eyeb.scale, 0.5, {
          z: 0.1,
          // y: 0.5,
          repeat: Infinity,
          yoyo: true,
          delay: 5,
          repeatDelay: 3 
        });
       
      } 
    }, 
    { 
      key: '_createBody', 
      value: function _createBody(){
        var group = new THREE.Group();
        //圆柱几何体模型的类
        var bodyGeom = new THREE.CylinderGeometry(5, 15, 25);
        bodyGeom.vertices[16].y += 3;
        bodyGeom.vertices[17].y -= 10;

        var body = new THREE.Mesh(bodyGeom, internals.materials.submarine);
        body.position.y = 1;
        body.position.z =0;

        //潜艇眼睛
        var eyeGeo = new THREE.CubeGeometry(3, 3, 5);
        var eye = new THREE.Mesh(eyeGeo, internals.materials.black);
        eye.position.set(5.5, -18, 3);
        body.add(eye);
        this.eye = eye;

        var eyeb = eye.clone();
        eyeb.position.x = eye.position.x * -1;
        this.eyeb = eyeb;
        body.add(eyeb);

        //潜艇鼻子
        var noseGeo = new THREE.SphereGeometry(1, 32, 32);
        noseGeo.vertices[2].x = 0;
        noseGeo.vertices[3].x = 0;
        noseGeo.vertices[6].x = 0;
        noseGeo.vertices[7].x = 0;
        var nose = new THREE.Mesh(noseGeo, internals.materials.blue);
        nose.position.set(0, -22.5, 0);
        body.add(nose);

        var nosetGeo = new THREE.SphereGeometry(2, 32, 32);
        nosetGeo.vertices[2].x = 0;
        nosetGeo.vertices[3].x = 0;
        nosetGeo.vertices[6].x = 0;
        nosetGeo.vertices[7].x = 0;
        var noset = new THREE.Mesh(nosetGeo, internals.materials.white);
        noset.position.set(0, -20.7, 0);
        body.add(noset);

        //潜艇嘴巴
        var mouthGeo = new THREE.CylinderGeometry(5, 5, 10,45);
        var mouth = new THREE.Mesh(mouthGeo, internals.materials.gray);
        mouth.position.set(0, -13, -3);
        body.add(mouth);

        //潜艇窗户
        var windowGeo = new THREE.CylinderGeometry(2, 2, 3, 64);
        var window = new THREE.Mesh(windowGeo, internals.materials.blue);
        window.position.set(-10, -2, 1);
        window.rotateZ(-Math.PI /2);
        body.add(window);

        var window1 = window.clone();
        window1.position.y = window.position.y - 4.5;
        window1.position.x = window.position.x - 2;
        window1.position.z = window.position.z + 0.4;
        this.window1 = window1;
        body.add(window1);

        var window2 = window.clone();
        window2.position.y = window.position.y + 4.7;
        window2.position.x = window.position.x + 1.9;
        window2.position.z = window.position.z - 0.4;
        this.window2 = window2;
        body.add(window2);

        var window3 = window1.clone();
        window1.position.x = window.position.x * (-1)+ 2;
        this.window3 = window3;
        body.add(window3);

        var window4 = window.clone();
        window4.position.x = window.position.x*(-1) + 0.7;
        this.window4 = window4;
        body.add(window4);

        var window5 = window2.clone();
        window5.position.x = window2.position.x *(-1) + 0.4;
        this.window5 = window5;
        body.add(window5);

        group.add(body);
        internals.shadowSupport(group);
        return group;
      } 
    }, 
    { 
      key: '_createWings', 
      value: function _createWings() {
        var group = new THREE.Group();
        var geometry = new THREE.CubeGeometry(7, 7, 0.5);

        geometry.vertices[2].y += 2;
        geometry.vertices[3].y += 2;
        geometry.vertices[2].x -= 1;
        geometry.vertices[3].x -= 1;

        var wingR = new THREE.Mesh(geometry, internals.materials.brown);
        wingR.position.x = 6;
        wingR.position.y = 8;
        wingR.position.z = 1;

        var wingL = wingR.clone();
        wingL.position.x = -6;
        wingL.rotation.y = Math.PI;

        group.add(wingR);
        group.add(wingL);

        internals.shadowSupport(group);

        return group;
      } 
    }, 
    { 
      key: '_createPaddles', 
      value: function _createPaddles(){
        var group = new THREE.Group();
        var geometry = new THREE.CylinderGeometry(1.5, 1, 5, 4);

        geometry.vertices[8].y += 0.5;

        var leafA = new THREE.Mesh(geometry, internals.materials.submarine);
        leafA.position.y = 16;
        

        var leafB = leafA.clone();
        leafB.position.x = -1.75;
        leafB.position.y = 15;
        leafB.rotation.z = 0.4;

        var leafC = leafB.clone();
        leafC.position.x = leafB.position.x * -1;
        leafC.rotation.z = leafB.rotation.z * -1;

        group.add(leafA);
        group.add(leafB);
        group.add(leafC);

        internals.shadowSupport(group);

        return group;
      } 
    }
  ]);
return Submarine;
}();


// 创建WebGL渲染器
internals.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// 创建相机对象（透视相机）
internals.camera = new THREE.PerspectiveCamera(45, internals.W / internals.H, 1, 1000);
// 创建场景元素对象
internals.scene = new THREE.Scene();
//定义线性雾
internals.scene.fog = new THREE.Fog(0xd5f8f8, 100, 300);

  // 创建轴对象，指定长度
// var axes = new THREE.AxesHelper(20); 
// internals.scene.add(axes);

// 设置渲染器
internals.renderer.setPixelRatio(window.devicePixelRatio);//返回当前设备的像素比
internals.renderer.setClearColor(0xc5f5f5, .7);//设置清除的颜色和透明度。  
internals.renderer.setSize(internals.W, internals.H);//返回一个包含渲染器输出canvas宽高的对象，以像素为单位
internals.renderer.shadowMap.enabled = true;//启用在场景中的阴影贴图
document.body.appendChild(internals.renderer.domElement);//启用在场景中的阴影贴图

// 设置相机的位置
internals.camera.position.set(40, 20, 100);
internals.scene.add(internals.camera);

// 添加轨道控制器
internals.controls = new THREE.OrbitControls(internals.camera, internals.renderer.domElement);
internals.controls.minDistance = 50;
internals.controls.maxDistance = 250;

// 创建光源 平行光源
(function setupLights() {

  var directional = new THREE.DirectionalLight(0xffffff, 1); // 模拟太阳的光源
  directional.position.set(30, 20, 0);
  directional.castShadow = true; //照将产生动态阴影

  internals.scene.add(new THREE.AmbientLight(0xc5f5f5, 1)); // 环境光源
  internals.scene.add(directional); // 环境中加入环境光
})();

// 创建地平面
(function createFloor() {
  var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
  var material = new THREE.MeshBasicMaterial( {color: 0x008080, side: THREE.DoubleSide} );
  var floor = new THREE.Mesh( geometry, material );
  
  //var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshBasicMaterial({ color: 0x008080 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -100;

  internals.scene.add(floor);
})();

// 创建潜艇和鱼
(function addElements() {

  internals.scene.add(new Submarine().mesh);
  internals.scene.add(new Fish({ y: -5, z: 20 }).mesh);
  internals.scene.add(new Fish({ y: 0, z: 10, delay: 1 }).mesh);
  internals.scene.add(new Fish({ y: 15, z: -10, delay: .5 }).mesh);
  internals.scene.add(new Fish({ y: -15, z: 10, delay: 2 }).mesh);

  internals.scene.add(new Fish({ y: -55, z: 30 }).mesh);
  internals.scene.add(new Fish({ y: 20, z: 40, delay: 1 }).mesh);
  internals.scene.add(new Fish({ y: 35, z: -30, delay: .5 }).mesh);
  internals.scene.add(new Fish({ y: -35, z: 60, delay: 2 }).mesh);
})();


// 浏览器自适应
internals.resizeHandler = function () {
  internals.W = window.innerWidth;
  internals.H = window.innerHeight;

  internals.renderer.setSize(internals.W, internals.H);
  internals.camera.aspect = internals.W / internals.H;
  internals.camera.updateProjectionMatrix();
};
// 监听浏览器窗口是否改变
window.addEventListener('resize', internals.resizeHandler, false);  
internals.resizeHandler();

internals.render = function () {
  return internals.renderer.render(internals.scene, internals.camera);
};
TweenLite.ticker.addEventListener("tick", internals.render);
