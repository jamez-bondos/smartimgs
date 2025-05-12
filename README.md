# SmartIMGs

SmartIMGs 是一款基于 Next.js 构建的 AI 驱动应用，专注于提供极简、高效、精准的图片智能描述生成服务。生成的描述文本可直接作为 AI 绘图提示词，助您最大程度还原并重现原始图片的视觉效果与细节。

## 📸 预览

![smartimgs-preview](./public/og.jpg)

## ✨ 核心功能

- 🚀 **一键操作**：上传图片即可自动生成智能描述，简单高效。
- 🖋️ **精准描述**：利用先进AI模型分析图片内容，生成详细准确的文字描述。
- 🌍 **先进多模态模型**：采用 Google Gemini 2.5 Flash 多模态模型，描述更准确。
- 📱 **响应式设计**：适配桌面和移动设备，随时随地使用。

## 🛠️ 技术栈

- **框架**: Next.js 15.3 (App Router)
- **开发语言**: TypeScript
- **样式**: Tailwind CSS
- **AI服务**:
  - OpenAI SDK
  - gemini-2.5-flash-preview 模型
- **交互**:
  - react-dropzone (图片上传)

## 🚀 快速开始

1. 克隆仓库：

```bash
git clone https://github.com/jamez-bondos/smartimgs.git
```

2. 安装依赖：

```bash
npm install
```

3. 创建环境变量文件 `.env`：

```
GEMINI_API_KEY=
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
```

获取 Gemini API Key: https://ai.google.dev/gemini-api/docs/api-key

4. 启动开发服务器：

```bash
npm run dev
```

## 💡 使用指南

1. 点击或拖拽上传您的图片（支持PNG、JPEG、WEBP格式）。
2. 选择描述生成模型（默认使用Gemini 2.5 Flash Preview）。
3. 点击"Generate"按钮开始处理。
4. 等待系统生成描述。
5. 查看并利用生成的图片描述。

## 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request。

## 🙏 Credits

本项目参考与借鉴了以下优秀的开源项目和资源：

- 项目结构基于 [@Nutlope/smartpdfs](https://github.com/Nutlope/smartpdfs)
- 提示词参考：[@dontbesilent12的推文](https://x.com/dontbesilent12/status/1919633554352570511)
- 项目灵感来源：[@hellokaton/remove-bg](https://github.com/hellokaton/remove-bg)

## 📝 许可证

[MIT](LICENSE)
