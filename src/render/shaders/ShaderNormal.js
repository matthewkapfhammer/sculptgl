define([
  'render/shaders/ShaderBase',
  'render/Attribute'
], function (ShaderBase, Attribute) {

  'use strict';

  var glfloat = 0x1406;

  var ShaderNormal = {};
  ShaderNormal.uniforms = {};
  ShaderNormal.attributes = {};
  ShaderNormal.program = undefined;

  ShaderNormal.uniformNames = [];
  Array.prototype.push.apply(ShaderNormal.uniformNames, ShaderBase.uniformNames.commonUniforms);

  ShaderNormal.vertex = [
    'precision mediump float;',
    'attribute vec3 aVertex;',
    'attribute vec3 aNormal;',
    'attribute vec3 aMaterial;',
    ShaderBase.strings.vertUniforms,
    'varying vec3 vVertex;',
    'varying vec3 vNormal;',
    'varying float vMasking;',
    'void main() {',
    '  vMasking = aMaterial.z;',
    '  vNormal = mix(aNormal, uEN * aNormal, vMasking);',
    '  vNormal = normalize(uN * vNormal);',
    '  vec4 vertex4 = vec4(aVertex, 1.0);',
    '  vertex4 = mix(vertex4, uEM *vertex4, vMasking);',
    '  vVertex = vec3(uMV * vertex4);',
    '  gl_Position = uMVP * vertex4;',
    '}'
  ].join('\n');

  ShaderNormal.fragment = [
    'precision mediump float;',
    'varying vec3 vVertex;',
    'varying vec3 vNormal;',
    ShaderBase.strings.fragColorUniforms,
    ShaderBase.strings.fragColorFunction,
    'void main() {',
    '  gl_FragColor = getFragColor(vNormal * 0.5 + 0.5);',
    '}'
  ].join('\n');
  /** Draw */
  ShaderNormal.draw = function (render, main) {
    render.getGL().useProgram(this.program);
    this.bindAttributes(render);
    this.updateUniforms(render, main);
    ShaderBase.drawBuffer(render);
  };
  /** Get or create the shader */
  ShaderNormal.getOrCreate = function (gl) {
    return ShaderNormal.program ? ShaderNormal : ShaderBase.getOrCreate.call(this, gl);
  };
  /** Initialize attributes */
  ShaderNormal.initAttributes = function (gl) {
    var program = ShaderNormal.program;
    var attrs = ShaderNormal.attributes;
    attrs.aVertex = new Attribute(gl, program, 'aVertex', 3, glfloat);
    attrs.aNormal = new Attribute(gl, program, 'aNormal', 3, glfloat);
    attrs.aMaterial = new Attribute(gl, program, 'aMaterial', 3, glfloat);
  };
  /** Bind attributes */
  ShaderNormal.bindAttributes = function (render) {
    var attrs = ShaderNormal.attributes;
    attrs.aVertex.bindToBuffer(render.getVertexBuffer());
    attrs.aNormal.bindToBuffer(render.getNormalBuffer());
    attrs.aMaterial.bindToBuffer(render.getMaterialBuffer());
  };
  /** Updates uniforms */
  ShaderNormal.updateUniforms = function (render, main) {
    ShaderBase.updateUniforms.call(this, render, main);
  };

  return ShaderNormal;
});