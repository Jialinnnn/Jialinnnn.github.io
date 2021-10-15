"use strict";

var canvas;
var canvas2;
var gl;
var gl2;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var delay = 500;
var delay2 = 200;

var vertices2 = [
	0.25, 0.0, 0.0,
	0.0, -0.05, 0.0,
	0.0, 0.2, 0.0,
	-0.05, 0.2, 0.0,
	-0.05, -0.2, 0.0,
	0.0, -0.2, 0.0,
	-0.7, -0.2, 0.0,
	-0.4, -0.2, 0.0,
	-0.4, -0.5, 0.0,
	0.3, -0.2, 0.0,
	0.3, -0.5, 0.0,
	0.6, -0.2, 0.0
];

window.onload = function initRotSquare(){
	var dirChange = document.getElementById("dirChange");
	var speedChange = document.getElementById("speedChange");
	
	canvas = document.getElementById("rot-canvas");
	canvas2 = document.getElementById("boat-canvas");
	
	gl = WebGLUtils.setupWebGL(canvas, "experimental-webgl");
	gl2 = WebGLUtils.setupWebGL(canvas2);
	if(!gl||!gl2){
		alert("WebGL isn't available.");
	}
	// Configure WebGL
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	
	var program = initShaders(gl, "rot-v-shader", "rot-f-shader");
	gl.useProgram(program);

	// Three Vertices
	var vertices = [
		 0.0 ,  1.0,
		 0.86, -0.5,
		-0.86, -0.5
	];
	
	// Three Colors
	var colors = [
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
	];
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var cbuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl2.STATIC_DRAW);	


	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
	
	thetaLoc = gl.getUniformLocation(program, "theta");
	
	dirChange.onclick = function(){
		direction  = direction * -1;
	}
	
	speedChange.onchange = function(){
		// console.log(speedChange.value);
		delay = 1000/speedChange.value;
	}
	
	init();
	
	renderSquare();
	
	
}

function renderSquare(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	// set uniform values
	theta += direction * 0.1;
	if(theta > 2 * Math.PI)
		theta -= (2 * Math.PI);
	else if(theta < -2 * Math.PI)
		theta += (2 * Math.PI);

	gl.uniform1f(thetaLoc, theta);

	gl.drawArrays(gl.TRIANGLES, 0, 3);

	// update and render
	setTimeout(function (){ requestAnimFrame( renderSquare ); }, delay);
}
