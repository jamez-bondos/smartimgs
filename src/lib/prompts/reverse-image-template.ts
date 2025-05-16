// src/lib/prompts/reverse-image-template.ts
export const promptTemplate = `
## Analyze Image for AI Art Prompt

Please analyze the attached image in detail. Your task is to generate a highly detailed, precise, and structured text prompt (hereinafter referred to as the 'image prompt'). The sole objective of this image prompt is that when it is input into an advanced image generation AI (e.g., Midjourney, DALL-E, GPT-4o, etc.), it enables the AI to regenerate the original image as faithfully and visually similarly as possible, including its aspect ratio.

The image prompt you generate must include, but is not limited to, the following key visual elements:
- Core Subject: Clearly describe the main focus of the image (person, animal, object, scene, etc.), including its posture, action, and expression (if applicable to living beings).
- Composition and Perspective: Describe the layout of the frame (e.g., close-up, medium shot, full shot, establishing shot, portrait, landscape orientation), the subject's position within the frame (e.g., centered, rule of thirds, leading lines, negative space), and the overall viewpoint or camera angle (e.g., eye-level, bird's-eye view, worm's-eye view, low-angle, high-angle, isometric view, orthographic view). Also, note any distinct lens effects or photographic techniques used (e.g., tilt-shift effect, fisheye lens, shallow depth of field/bokeh, motion blur, lens flare, Dutch angle).
- Environment and Background: Detail the subject's surroundings or background, including location, other objects, distant views, etc.
- Artistic Style: Identify and describe the overall style of the image (e.g., photorealistic, oil painting, watercolor, sketch, cartoon, anime, cyberpunk, steampunk, 3D render, concept art). If the style strongly resembles a specific artist (e.g., Van Gogh, H.R. Giger) or a well-known art movement (e.g., Impressionism, Surrealism), please state this explicitly.
- Lighting and Atmosphere: Describe the lighting conditions (e.g., bright daylight, dusk, overcast, studio lighting, Rembrandt lighting, volumetric lighting, neon glow), light direction, shadow effects, and the overall mood or atmosphere conveyed by the image (e.g., serene, mysterious, joyful, tense, eerie, nostalgic). Pay special attention to accurately capturing the emotional tone.
- Color: Describe the main color palette, tone (warm tones, cool tones), saturation, and contrast.
- Key Details: Mention any specific details crucial for accurate reproduction, such as clothing textures, object materials (e.g., metallic, wooden, glossy, matte), specific markings, visual elements, patterns, or text if present and significant.
- Image Quality/Medium: If possible, describe the image's texture or quality (e.g., high-definition, cinematic, film grain, blur effect, sharp focus, vintage photo, lens flare, digital painting feel).
- Negative Prompts: If discernible, identify elements or characteristics that should be avoided in the regeneration to prevent common misinterpretations or unwanted artifacts (e.g., "no text", "no extra limbs", "avoid blurry").

---

### High-Quality Prompt Examples for Reference:
To guide your prompt generation, here are some examples of high-quality, detailed, and structured text prompts that are effective for advanced image generation AIs. Aim to produce prompts of similar caliber.
Example 1:
- Reasoning: Extremely detailed, excellent mood, lighting, composition, and emotional depth.
- Prompt: "高分辨率的黑白肖像艺术作品，采用编辑类和艺术摄影风格。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。画面右侧，一个模糊却惊艳的哈利波特面容从阴影中隐约浮现，并非传统的摆拍，而像是被捕捉于思索或呼吸之间的瞬间。他的脸部只露出一部分：也许是一个眼睛、一块颧骨，还有唇角的轮廓，唤起神秘、亲密与优雅之感。他的五官精致而深刻，散发出忧郁与诗意之美，却不显矫饰。一束温柔的定向光，柔和地漫射开来，轻抚他的面颊曲线，或在眼中闪现光点——这是画面的情感核心。其余部分以大量负空间占据，刻意保持简洁，使画面自由呼吸。画面中没有文字、没有标志——只有光影与情绪交织。整体氛围抽象却深具人性，仿佛一瞥即逝的目光，或半梦半醒间的记忆：亲密、永恒、令人怅然的美。"

Example 2:
- Reasoning: Incredibly detailed character, environment, atmosphere, and nostalgic elements, very specific.
- Prompt: "超写实的 3D 渲染画面，重现了2008年《命令与征服：红色警戒3》中娜塔莎的角色设计，完全依照原版建模。场景设定在一个昏暗杂乱的2008年代卧室里，角色正坐在地毯上，面对一台正在播放《命令与征服：红色警戒3》的老式电视和游戏机手柄。整个房间充满了2008年代的怀旧氛围：零食包装袋、汽水罐、海报以及纠缠在一起的电线。娜塔莎·沃尔科娃在画面中被抓拍到转头的一瞬，回眸看向镜头，她那标志性的空灵美丽面容上带着一抹纯真的微笑。她的上半身微微扭转，动态自然，仿佛刚刚被闪光灯惊到而做出的反应。闪光灯轻微地过曝了她的脸和衣服，使她的轮廓在昏暗的房间中更加突出。整张照片显得原始而自然，强烈的明暗对比在她身后投下深邃的阴影，画面充满触感，带有一种真实的2008年胶片快照的模拟质感。"

Example 3:
- Reasoning: Highly detailed style, effect, elements, mood, rendering, very evocative.
- Prompt: "從上方俯瞰的超高細節迷你【Cyberpunk】景觀，採用傾斜移軸鏡頭效果。場景中充滿如玩具般的元素，全部以高解析度 CG 呈現。光線戲劇化，營造出大片的氛圍，色彩鮮明，對比強烈，強調景深效果與擬真微觀視角，使觀者仿佛俯瞰一個玩具世界般的迷你現實，畫面中包含大量視覺笑點與極具重複觀看價值的細節設計。"

Example 4:
- Reasoning: Hyper-realistic, incredibly detailed micro-scene, materials, lighting, perspective.
- Prompt: "A hyper-realistic isometric 3D render of a miniature computer setup inside a translucent mechanical keyboard keycap, specifically placed on the ESC key of a real matte-finished mechanical keyboard. Inside the keycap, a tiny figure sits in a modern ergonomic chair, wearing a cozy textured hoodie, working at a glowing ultra-realistic computer screen. The environment is packed with lifelike miniature tech accessories: real-material desk lamps, monitors with reflections, tiny speaker grills, tangled cables, and ceramic mugs. The base of the scene is made of soil, rocks, and moss, with photorealistic textures and imperfections. The lighting inside the cap mimics natural morning sun, casting soft shadows and warm tones, while the outside has cold ambient reflections from the surrounding keyboard. The word “ESC” is subtly etched onto the top of the translucent keycap with a faint frosted glass effect — just barely visible depending on the angle. The surrounding keyboard keys like F1, Q, Shift, and CTRL are crisp, textured, and photorealistically lit. Shot as if taken with a high-end mobile phone camera, with shallow depth of field, perfect white balance, and cinematic detail."

Example 5:
- Reasoning: Extremely detailed description of a complex Lego scene, covering all aspects.
- Prompt: "创建一幅高度精细且色彩鲜艳的乐高版上海外滩景象。前景呈现经典的外滩历史建筑群，用乐高砖块精致还原西式与新古典主义风格的建筑立面，包括钟楼、穹顶、柱廊等细节。乐高小人们正在沿江漫步、拍照、观光，街道两旁停靠着经典样式的乐高汽车。背景是壮观的黄浦江，以蓝色半透明乐高砖拼接，江面上有乐高渡轮和游览船。对岸的浦东陆家嘴高楼林立，包括东方明珠塔、上海中心、金茂大厦和环球金融中心，这些超现代乐高摩天大楼色彩丰富、造型逼真。天空为乐高明亮蓝色，点缀少量白色乐高积木云朵，整体呈现充满活力与现代感的视觉效果。"

---

When analyzing the attached image, strive to create a prompt that captures this level of detail and structure, tailored to the specific content of the image.

Please provide the final generated image prompt as the sole output. Ensure it is a coherent text string suitable for direct copy-pasting into an image generation AI. Do not include any explanations, titles, or additional dialogue; output only the final image prompt itself, optimized for image generation.
Output language: @{{promptLang}}.
`;