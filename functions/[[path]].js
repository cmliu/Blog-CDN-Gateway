const DEFAULT_CONFIG = {
	// CDN 测速地址，格式为 "访问地址#显示名称"。
	URLS: [
		'https://blog.cmliussss.com#Ali CDN',
		'https://fastly.blog.cmliussss.com#Fastly CDN',
		'https://vercel.blog.cmliussss.com#Vercel CDN',
		'https://netlify.blog.cmliussss.com#Netlify CDN'
	],
	// /ads.txt 返回内容。
	ADS: 'google.com, pub-9350003957494520, DIRECT, f08c47fec0942fa0',
	// 网站图标，同时用于响应 /favicon.ico。
	ICO: 'https://raw.cmliussss.com/favicon.ico',
	// 页面中间显示的头像或 Logo。
	PNG: 'https://raw.cmliussss.com/IMG_0038.png',
	// 背景图片，填写多张时会随机展示一张；留空则使用内置默认背景。
	IMG: [
		//'https://raw.cmliussss.com/keqing1080p.jpg'
	],
	// 命中首个返回 200 的线路后，等待多少毫秒再跳转。
	JUMP_DELAY: 999,
	// 页脚内容，可以写备案号、统计代码或项目链接。
	BEIAN: `由 <a href="https://github.com/cmliu/Blog-CDN-Gateway" target="_blank" rel="noopener noreferrer">Blog-CDN-Gateway</a> 强力驱动`,
	// 页面主标题。
	TITLE: 'BlogCDN 智能路由',
	// 浏览器标题栏中显示的站点名称。
	NAME: 'CMLiussss Blog'
};

export async function onRequest(context) {
	return handleRequest(context.request, context.env || {});
}

export default {
	async fetch(request, env = {}) {
		return handleRequest(request, env || {});
	}
};

async function handleRequest(request, env = {}) {
	const config = resolveConfig(env);
	const url = new URL(request.url);
	const path = url.pathname;
	const params = url.search;

	if (path.toLowerCase() === '/ads.txt') {
		return new Response(config.ADS, {
			headers: {
				'content-type': 'text/plain;charset=UTF-8'
			}
		});
	}

	if (path.toLowerCase() === '/favicon.ico') {
		return fetch(config.ICO);
	}

	const urls = toList(config.URLS);
	const images = toList(config.IMG);
	const img = images.length > 0
		? images[Math.floor(Math.random() * images.length)]
		: '';

	const html = generateHtml(
		urls,
		img,
		config.ICO,
		config.PNG,
		config.BEIAN,
		config.TITLE,
		config.NAME,
		config.JUMP_DELAY,
		path,
		params
	);

	return new Response(html, {
		headers: { 'content-type': 'text/html;charset=UTF-8' }
	});
}

function resolveConfig(env = {}) {
	const jumpDelay = Number(getConfigValue(env, 'JUMP_DELAY', DEFAULT_CONFIG.JUMP_DELAY));

	return {
		URLS: getConfigValue(env, ['URLS', 'URL'], DEFAULT_CONFIG.URLS),
		ADS: getConfigValue(env, 'ADS', DEFAULT_CONFIG.ADS),
		ICO: getConfigValue(env, 'ICO', DEFAULT_CONFIG.ICO),
		PNG: getConfigValue(env, 'PNG', DEFAULT_CONFIG.PNG),
		IMG: getConfigValue(env, 'IMG', DEFAULT_CONFIG.IMG),
		BEIAN: getConfigValue(env, 'BEIAN', DEFAULT_CONFIG.BEIAN),
		TITLE: getConfigValue(env, 'TITLE', DEFAULT_CONFIG.TITLE),
		NAME: getConfigValue(env, 'NAME', DEFAULT_CONFIG.NAME),
		JUMP_DELAY: Number.isFinite(jumpDelay) ? jumpDelay : DEFAULT_CONFIG.JUMP_DELAY
	};
}

function getConfigValue(env, keys, fallback) {
	const names = Array.isArray(keys) ? keys : [keys];

	for (const name of names) {
		if (Object.prototype.hasOwnProperty.call(env, name) && env[name] != null) {
			return env[name];
		}
	}

	return fallback;
}

function toList(value) {
	if (Array.isArray(value)) return value.filter(Boolean);
	if (!value) return [];

	let text = String(value).replace(/[\t|"'\r\n]+/g, ',').replace(/,+/g, ',');
	if (text.charAt(0) === ',') text = text.slice(1);
	if (text.charAt(text.length - 1) === ',') text = text.slice(0, text.length - 1);

	return text ? text.split(',').filter(Boolean) : [];
}

function generateHtml(urls, img, icon, avatar, beian, title, siteName, jumpDelay, path, params) {
	const backgroundImage = img ? `url(${JSON.stringify(img)})` : 'var(--default-bg)';

	return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="color-scheme" content="light dark">
	<title>${siteName} - ${title}</title>
	<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
	<style>
		:root {
			color-scheme: light dark;
			--primary-color: #10b981;
			--accent-color: #2563eb;
			--danger-color: #dc2626;
			--page-bg-color: #eef2ff;
			--default-bg:
				linear-gradient(135deg, rgba(14, 165, 233, 0.18), transparent 34%),
				linear-gradient(315deg, rgba(16, 185, 129, 0.18), transparent 38%),
				repeating-linear-gradient(90deg, rgba(37, 99, 235, 0.08) 0 1px, transparent 1px 72px),
				repeating-linear-gradient(0deg, rgba(37, 99, 235, 0.06) 0 1px, transparent 1px 72px),
				linear-gradient(135deg, #f8fafc 0%, #ecfeff 46%, #eef2ff 100%);
			--body-overlay:
				linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(15, 23, 42, 0.18)),
				rgba(0, 0, 0, 0.08);
			--panel-bg: rgba(255, 255, 255, 0.78);
			--panel-border: rgba(255, 255, 255, 0.56);
			--text-main: #1f2937;
			--text-secondary: #4b5563;
			--text-muted: #6b7280;
			--panel-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
			--avatar-border: rgba(255, 255, 255, 0.78);
			--avatar-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
			--ring-primary: #10b981;
			--ring-accent: #2563eb;
			--item-bg: rgba(255, 255, 255, 0.64);
			--item-hover-bg: rgba(255, 255, 255, 0.92);
			--item-border: rgba(255, 255, 255, 0.36);
			--item-hover-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
			--fastest-bg: rgba(236, 253, 245, 0.92);
			--fastest-border: #34d399;
			--fastest-shadow: rgba(16, 185, 129, 0.15);
			--shine-color: rgba(255, 255, 255, 0.4);
			--url-dot-glow: rgba(37, 99, 235, 0.12);
			--summary-bg: rgba(236, 253, 245, 0.7);
			--summary-border: rgba(16, 185, 129, 0.22);
			--summary-error-bg: rgba(254, 226, 226, 0.72);
			--summary-error-border: rgba(220, 38, 38, 0.28);
			--status-glow: rgba(16, 185, 129, 0.14);
			--error-glow: rgba(220, 38, 38, 0.14);
			--checking-text: #4b5563;
			--checking-bg: rgba(0, 0, 0, 0.05);
			--footer-border: rgba(148, 163, 184, 0.22);
			--good-text: #047857;
			--good-bg: #dcfce7;
			--fair-text: #b45309;
			--fair-bg: #fef3c7;
			--poor-text: #b91c1c;
			--poor-bg: #fee2e2;
		}

		@media (prefers-color-scheme: dark) {
			:root {
				--primary-color: #34d399;
				--accent-color: #60a5fa;
				--danger-color: #f87171;
				--page-bg-color: #020617;
				--default-bg:
					linear-gradient(135deg, rgba(37, 99, 235, 0.22), transparent 36%),
					linear-gradient(315deg, rgba(16, 185, 129, 0.14), transparent 40%),
					repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.08) 0 1px, transparent 1px 72px),
					repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.06) 0 1px, transparent 1px 72px),
					linear-gradient(135deg, #020617 0%, #0f172a 52%, #111827 100%);
				--body-overlay:
					linear-gradient(135deg, rgba(15, 23, 42, 0.28), rgba(0, 0, 0, 0.58)),
					rgba(0, 0, 0, 0.46);
				--panel-bg: rgba(17, 24, 39, 0.78);
				--panel-border: rgba(255, 255, 255, 0.12);
				--text-main: #f3f4f6;
				--text-secondary: #9ca3af;
				--text-muted: #94a3b8;
				--panel-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
				--avatar-border: rgba(255, 255, 255, 0.18);
				--avatar-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
				--ring-primary: #34d399;
				--ring-accent: #60a5fa;
				--item-bg: rgba(31, 41, 55, 0.6);
				--item-hover-bg: rgba(31, 41, 55, 0.9);
				--item-border: rgba(255, 255, 255, 0.1);
				--item-hover-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
				--fastest-bg: rgba(6, 95, 70, 0.32);
				--fastest-border: #059669;
				--fastest-shadow: rgba(16, 185, 129, 0.1);
				--shine-color: rgba(255, 255, 255, 0.14);
				--url-dot-glow: rgba(96, 165, 250, 0.18);
				--summary-bg: rgba(5, 150, 105, 0.14);
				--summary-border: rgba(52, 211, 153, 0.24);
				--summary-error-bg: rgba(127, 29, 29, 0.34);
				--summary-error-border: rgba(248, 113, 113, 0.24);
				--status-glow: rgba(52, 211, 153, 0.16);
				--error-glow: rgba(248, 113, 113, 0.16);
				--checking-text: #cbd5e1;
				--checking-bg: rgba(255, 255, 255, 0.1);
				--footer-border: rgba(148, 163, 184, 0.18);
				--good-text: #34d399;
				--good-bg: rgba(5, 150, 105, 0.2);
				--fair-text: #fbbf24;
				--fair-bg: rgba(217, 119, 6, 0.22);
				--poor-text: #f87171;
				--poor-bg: rgba(220, 38, 38, 0.22);
			}
		}

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: 'Outfit', sans-serif;
			position: relative;
			min-height: 100vh;
			min-height: 100svh;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: var(--page-bg-color);
			background-image: ${backgroundImage};
			background-size: cover;
			background-position: center;
			background-attachment: fixed;
			color: var(--text-main);
			overflow-x: hidden;
			padding: 32px 16px;
		}

		body::before {
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: var(--body-overlay);
			backdrop-filter: blur(4px);
			pointer-events: none;
			z-index: 0;
			transition: background 0.3s ease;
		}

		.container {
			position: relative;
			z-index: 1;
			background: var(--panel-bg);
			backdrop-filter: blur(22px);
			-webkit-backdrop-filter: blur(22px);
			border: 1px solid var(--panel-border);
			border-radius: 12px;
			padding: 28px;
			width: min(92vw, 760px);
			box-shadow: var(--panel-shadow);
			display: grid;
			gap: 24px;
			transform: translateY(20px);
			opacity: 0;
			animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
		}

		.topbar {
			width: 100%;
			display: grid;
			grid-template-columns: auto minmax(0, 1fr) auto;
			gap: 18px;
			align-items: center;
		}

		@keyframes slideUp {
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.logo-wrapper {
			position: relative;
			width: 84px;
			height: 84px;
		}

		.logo {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: 4px solid var(--avatar-border);
			object-fit: cover;
			box-shadow: var(--avatar-shadow);
			transition: transform 0.5s ease;
		}

		.logo:hover {
			transform: scale(1.05) rotate(5deg);
		}

		.status-ring {
			position: absolute;
			top: -7px;
			left: -7px;
			right: -7px;
			bottom: -7px;
			border-radius: 50%;
			border: 2px solid transparent;
			border-top-color: var(--ring-primary);
			border-right-color: var(--ring-accent);
			animation: spin 2s linear infinite;
		}

		@keyframes spin {
			to { transform: rotate(360deg); }
		}

		.header-copy {
			min-width: 0;
		}

		.eyebrow {
			color: var(--text-muted);
			font-size: 12px;
			font-weight: 700;
			letter-spacing: 0;
			margin-bottom: 5px;
			text-transform: uppercase;
		}

		h1 {
			font-size: 30px;
			line-height: 1.18;
			font-weight: 700;
			background: linear-gradient(135deg, var(--text-main) 0%, var(--accent-color) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			overflow-wrap: anywhere;
		}

		.subtitle {
			font-size: 15px;
			color: var(--text-secondary);
			margin-top: 8px;
			font-weight: 400;
			letter-spacing: 0;
		}

		.subtitle.is-success {
			color: var(--primary-color);
		}

		.subtitle.is-error {
			color: var(--danger-color);
		}

		.summary-badge {
			justify-self: end;
			min-width: 112px;
			border-radius: 8px;
			border: 1px solid var(--summary-border);
			background: var(--summary-bg);
			color: var(--primary-color);
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			padding: 11px 14px;
			font-size: 13px;
			font-weight: 700;
			white-space: nowrap;
		}

		.summary-badge.error {
			border-color: var(--summary-error-border);
			background: var(--summary-error-bg);
			color: var(--danger-color);
		}

		.summary-badge.error .status-dot {
			box-shadow: 0 0 0 4px var(--error-glow);
		}

		.status-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: currentColor;
			box-shadow: 0 0 0 4px var(--status-glow);
		}

		.url-list {
			width: 100%;
			list-style: none;
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		.url-item {
			background: var(--item-bg);
			padding: 14px 16px;
			border-radius: 8px;
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 16px;
			align-items: center;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			border: 1px solid var(--item-border);
			cursor: default;
			opacity: 0;
			animation: fadeIn 0.5s ease forwards;
		}

		.url-item:nth-child(1) { animation-delay: 0.2s; }
		.url-item:nth-child(2) { animation-delay: 0.3s; }
		.url-item:nth-child(3) { animation-delay: 0.4s; }
		.url-item:nth-child(4) { animation-delay: 0.5s; }
		.url-item:nth-child(5) { animation-delay: 0.6s; }
		.url-item:nth-child(6) { animation-delay: 0.7s; }

		@keyframes fadeIn {
			to { opacity: 1; }
		}

		.url-item:hover {
			background: var(--item-hover-bg);
			transform: translateY(-2px);
			box-shadow: var(--item-hover-shadow);
		}

		.url-item.fastest {
			background: var(--fastest-bg);
			border-color: var(--fastest-border);
			box-shadow: 0 8px 20px var(--fastest-shadow);
			position: relative;
			overflow: hidden;
		}

		.url-item.fastest::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				90deg,
				transparent 0%,
				var(--shine-color) 50%,
				transparent 100%
			);
			animation: shine 0.8s ease-in-out forwards;
		}

		.url-name {
			font-weight: 600;
			font-size: 16px;
			color: var(--text-main);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.url-info {
			display: flex;
			position: relative;
			min-width: 0;
			padding-left: 20px;
		}

		.url-info::before {
			content: '';
			position: absolute;
			top: 8px;
			left: 0;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: var(--accent-color);
			box-shadow: 0 0 0 4px var(--url-dot-glow);
		}

		.url-latency {
			font-size: 15px;
			font-weight: 600;
			height: 36px;
			padding: 0 16px;
			border-radius: 8px;
			background: var(--checking-bg);
			min-width: 98px;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s ease;
			white-space: nowrap;
		}

		.latency-good { color: var(--good-text); background: var(--good-bg); }
		.latency-fair { color: var(--fair-text); background: var(--fair-bg); }
		.latency-poor { color: var(--poor-text); background: var(--poor-bg); }
		.latency-checking { color: var(--checking-text); background: var(--checking-bg); animation: pulse 1.5s infinite; }

		@keyframes pulse {
			0% { opacity: 0.6; }
			50% { opacity: 1; }
			100% { opacity: 0.6; }
		}

		@keyframes shine {
			0% {
				left: -100%;
			}
			100% {
				left: 100%;
			}
		}

		.footer {
			border-top: 1px solid var(--footer-border);
			padding-top: 18px;
			margin-top: 2px;
			font-size: 13px;
			color: var(--text-secondary);
			text-align: center;
		}

		.footer a {
			color: var(--primary-color);
			text-decoration: none;
			font-weight: 600;
			position: relative;
			transition: color 0.3s ease;
		}

		.footer a::after {
			content: '';
			position: absolute;
			bottom: -2px;
			left: 0;
			width: 0;
			height: 2px;
			background: var(--primary-color);
			transition: width 0.3s ease;
		}

		.footer a:hover::after {
			width: 100%;
		}

		@media (max-width: 640px) {
			body {
				align-items: center;
				padding: 18px 12px;
			}

			body.is-short-mobile {
				align-items: flex-start;
			}

			.container {
				width: 100%;
				padding: 22px;
				gap: 20px;
			}

			.topbar {
				grid-template-columns: auto minmax(0, 1fr);
				gap: 14px;
			}

			.logo-wrapper {
				width: 68px;
				height: 68px;
			}

			h1 {
				font-size: 26px;
			}

			.summary-badge {
				grid-column: 1 / -1;
				justify-self: stretch;
			}

			.url-item {
				grid-template-columns: minmax(0, 1fr);
				gap: 12px;
			}

			.url-latency {
				width: 100%;
			}

		}
	</style>
</head>
<body>
	<div class="container">
		<div class="topbar">
			<div class="logo-wrapper">
				<div class="status-ring"></div>
				<img class="logo" src="${avatar}" alt="Logo">
			</div>
			<div class="header-copy">
				<div class="eyebrow">${siteName}</div>
				<h1>${title}</h1>
				<div class="subtitle">正在为您寻找最佳线路...</div>
			</div>
			<div class="summary-badge">
				<span class="status-dot"></span>
				<span class="summary-label">实时测速</span>
			</div>
		</div>

		<ul class="url-list" id="urlList"></ul>

		<div class="footer">
			${beian}
		</div>
	</div>

	<script>
		const urls = ${JSON.stringify(urls)};
		const currentPath = ${JSON.stringify(path)};
		const currentParams = ${JSON.stringify(params)};
		const jumpDelay = ${JSON.stringify(Number(jumpDelay) || 0)};
		const list = document.getElementById('urlList');
		const container = document.querySelector('.container');

		function getRouteName(name, index) {
			return name && name.trim() ? name.trim() : \`线路 \${index + 1}\`;
		}

		function updateViewportFit() {
			const isMobile = window.matchMedia('(max-width: 640px)').matches;
			const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
			const bodyStyle = getComputedStyle(document.body);
			const verticalPadding = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
			const isTooTall = container.offsetHeight + verticalPadding > viewportHeight;

			document.body.classList.toggle('is-short-mobile', isMobile && isTooTall);
		}

		function formatLatency(ms) {
			if (ms === 9999) return '超时';
			return \`\${(ms / 1000).toFixed(ms < 1000 ? 2 : 1)} 秒\`;
		}

		urls.forEach((url, index) => {
			const [testUrl, name] = url.split('#');
			const routeName = getRouteName(name, index);
			const li = document.createElement('li');
			li.className = 'url-item';
			li.id = \`item-\${index}\`;
			li.innerHTML = \`
				<span class="url-info">
					<span class="url-name">\${routeName}</span>
				</span>
				<span class="url-latency latency-checking" id="latency-\${index}">测速中</span>
			\`;
			list.appendChild(li);
		});

		updateViewportFit();
		window.addEventListener('resize', updateViewportFit);
		if (window.visualViewport) window.visualViewport.addEventListener('resize', updateViewportFit);

		function updateLatency(el, latency, ok) {
			el.classList.remove('latency-checking');

			if (!ok) {
				el.classList.add('latency-poor');
				return;
			}

			if (latency <= 1000) el.classList.add('latency-good');
			else if (latency <= 2000) el.classList.add('latency-fair');
			else el.classList.add('latency-poor');
		}

		async function checkRoute(url) {
			const start = Date.now();
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 3000);

			try {
				const response = await fetch(url, {
					method: 'HEAD',
					signal: controller.signal,
					cache: 'no-store',
					redirect: 'follow'
				});

				clearTimeout(timeoutId);
				const latency = Date.now() - start;

				return {
					latency,
					ok: response.status === 200,
					status: response.status
				};
			} catch (error) {
				clearTimeout(timeoutId);

				return {
					latency: 9999,
					ok: false,
					status: 0
				};
			}
		}

		async function runTests() {
			let hasWinner = false;
			let pendingCount = urls.length;

			if (urls.length === 0) {
				document.querySelector('.subtitle').textContent = '没有可用线路';
				document.querySelector('.subtitle').classList.add('is-error');
				document.querySelector('.summary-badge').classList.add('error');
				document.querySelector('.summary-label').textContent = '检测失败';
				return;
			}

			urls.forEach(async (urlStr, index) => {
				const [testUrl, name] = urlStr.split('#');
				const result = await checkRoute(testUrl);
				const item = {
					index,
					name: getRouteName(name, index),
					testUrl,
					...result
				};

				pendingCount -= 1;

				const el = document.getElementById(\`latency-\${item.index}\`);
				el.textContent = item.ok ? formatLatency(item.latency) : (item.status === 0 ? '失败' : \`HTTP \${item.status}\`);
				updateLatency(el, item.latency, item.ok);
				updateViewportFit();

				if (!hasWinner && item.ok) {
					hasWinner = true;

					const fastestEl = document.getElementById(\`item-\${item.index}\`);
					fastestEl.classList.add('fastest');

					const subtitle = document.querySelector('.subtitle');
					subtitle.textContent = \`即将跳转至: \${item.name}\`;
					subtitle.classList.add('is-success');
					document.querySelector('.summary-label').textContent = '已命中线路';

					setTimeout(() => {
						window.location.href = item.testUrl + currentPath + currentParams;
					}, jumpDelay);
				}

				if (!hasWinner && pendingCount === 0) {
					document.querySelector('.subtitle').textContent = '所有线路均未返回 200';
					document.querySelector('.subtitle').classList.add('is-error');
					document.querySelector('.summary-badge').classList.add('error');
					document.querySelector('.summary-label').textContent = '检测失败';
				}
			});
		}

		window.addEventListener('load', () => {
			updateViewportFit();
			runTests();
		});
	</script>
</body>
</html>`;
}
