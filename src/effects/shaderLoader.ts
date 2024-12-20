import maskFragment from "./maskEffect.glsl";
import circleFragment from "./circleEffect.glsl";

import { ShaderStore } from "@babylonjs/core/Engines/shaderStore";

import { generatePipelineContext } from "@babylonjs/core/Materials/effect.webgl.functions";

import "@babylonjs/core/Shaders/postprocess.vertex";

export function loadShadersAsync(context: WebGL2RenderingContext | WebGLRenderingContext) {
    ShaderStore.ShadersStore["circlePixelShader"] = circleFragment;
    ShaderStore.ShadersStore["maskPixelShader"] = maskFragment;

    const compileCircleTask = generatePipelineContext(
        {
           shaderNameOrContent: {
              vertex: "postprocess",
              fragment: "circle",
           },
           waitForIsReady: false,
        },
        context,
    );

    const compileMaskTask = generatePipelineContext(
        {
           shaderNameOrContent: {
              vertex: "postprocess",
              fragment: "mask",
           },
           waitForIsReady: false,
        },
        context,
    );

    return Promise.all([compileCircleTask, compileMaskTask]);
}