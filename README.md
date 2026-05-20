# Blog-CDN-Gateway

![Blog-CDN-Gateway](./Blog-CDN.png)

Blog-CDN-Gateway 是一个轻量级 CDN 智能访问网关。访问任意路径时，页面会在浏览器端并发检测多条 CDN 线路，命中首个返回 HTTP 200 的线路后自动跳转，并保留原始 path 与 query 参数。

## 功能特性

- 多 CDN 线路并发测速
- 命中首个可用线路后自动跳转
- 保留访问路径和查询参数
- 支持 `/ads.txt` 和 `/favicon.ico`
- 支持 Cloudflare Workers / Pages 与 EdgeOne Pages
- 支持通过环境变量覆盖默认配置
- 内置浅色、深色自适应测速页面

## 环境变量

| 变量名 | 示例 | 说明 |
| --- | --- | --- |
| `URLS` | `https://blog.example.com#主线路,https://cdn.example.com#备用线路` | CDN 测速地址。格式为 `访问地址#显示名称`，多条线路可用逗号、换行或制表符分隔。 |
| `URL` | `https://blog.example.com#主线路` | `URLS` 的兼容别名。若同时配置，优先使用 `URLS`。 |
| `ADS` | `google.com, pub-xxxx, DIRECT, f08c47fec0942fa0` | `/ads.txt` 返回内容。 |
| `ICO` | `https://raw.cmliussss.com/favicon.ico` | 网站图标，同时用于响应 `/favicon.ico`。 |
| `PNG` | `https://raw.cmliussss.com/IMG_0038.png` | 页面中显示的头像或 Logo。 |
| `IMG` | `https://raw.cmliussss.com/keqing1080p.jpg` | 页面背景图。可配置多张，随机展示；留空则使用内置默认背景。 |
| `NAME` | `CMLiussss Blog` | 站点名称，显示在浏览器标题和页面顶部。 |
| `TITLE` | `BlogCDN 智能路由` | 页面主标题。 |
| `BEIAN` | `<a href="https://icp.gov.moe/">萌ICP备...</a>` | 页脚内容，可放备案号、统计代码或项目链接。 |
| `JUMP_DELAY` | `999` | 命中可用线路后等待多久再跳转，单位为毫秒。 |

## 线路配置示例

```text
https://blog.cmliussss.com#Ali CDN,
https://fastly.blog.cmliussss.com#Fastly CDN,
https://vercel.blog.cmliussss.com#Vercel CDN,
https://netlify.blog.cmliussss.com#Netlify CDN
```

跳转目标会自动拼接当前访问路径与查询参数。例如访问：

```text
https://gateway.example.com/posts/hello?from=cdn
```

若命中线路为 `https://fastly.blog.cmliussss.com#Fastly CDN`，最终会跳转到：

```text
https://fastly.blog.cmliussss.com/posts/hello?from=cdn
```

## 本地调试

```bash
npm install
npm run dev
```

项目入口文件为 `functions/[[path]].js`。本地调试默认使用 `wrangler pages dev .`。

## 部署

Cloudflare Pages / Workers 可使用：

```bash
npm run deploy
```

EdgeOne Pages 使用仓库内的 `edgeone.json`，函数目录为 `functions`，入口同样是 `functions/[[path]].js`。

## 默认配置

未设置环境变量时，项目会使用 `functions/[[path]].js` 中的 `DEFAULT_CONFIG`。当前默认包含：

- 多条 CDN 测速地址
- 默认 `/ads.txt` 内容
- 默认网站图标与头像
- 内置背景样式
- 默认跳转延迟 `999ms`

## 致谢

感谢 CMLiussss 与开源社区的创意和实现。
