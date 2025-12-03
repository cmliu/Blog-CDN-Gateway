let urls = [
    'https://blog.cmliussss.com#EdgeOne CDN',
    'https://ali.blog.cmliussss.com#Ali CDN',
    'https://fastly.blog.cmliussss.com#Fastly CDN',
    'https://vercel.blog.cmliussss.com#Vercel CDN',
    'https://netlify.blog.cmliussss.com#Netlify CDN'
];

/**
 * EdgeOne Pages 入口函数
 * @param {Object} context - EdgeOne Pages 上下文对象
 * @returns {Promise<Response>}
 */
export async function onRequest(context) {
    return await handleRequest(context.request, context.env);
}

/**
 * Cloudflare Workers 入口函数
 * @returns {Object} Worker 处理器对象
 */
export default {
    async fetch(request, env, ctx) {
        return await handleRequest(request, env);
    }
};

async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const params = url.search;

    let currentUrls = urls;
    // 如果 env.URL 存在，则使用 env.URL 替换默认 urls
    if (env.URL) currentUrls = await ADD(env.URL);

    const ads = env.ADS || 'google.com, pub-9350003957494520, DIRECT, f08c47fec0942fa0';
    const 网站图标 = env.ICO || 'https://raw.cmliussss.com/favicon.ico';
    const 网站头像 = env.PNG || 'https://raw.cmliussss.com/IMG_0038.png';
    const 网络备案 = env.BEIAN || `<b>📈今日访问人数:</b><span id="visitCount">加载中...</span> <b>📊当前在线人数:</b><div id="liveuser" style="display: inline;">加载中...</div> <script src="https://liveuser.cmliussss.com/main.js?sessionId=blog.cmliussss.com"></script> <script> fetch('https://tongji.blog.cmliussss.com/?id=blog.cmliussss.com') .then(r => r.json()) .then(d => document.getElementById('visitCount').innerText = d.visitCount) .catch(e => document.getElementById('visitCount').innerText = '加载失败'); </script>`;
    const 网页标题 = env.TITLE || 'BlogCDN 智能访问网关';
    const 站点名称 = env.NAME || 'CMLiussss Blog';

    if (url.pathname.toLowerCase() == '/ads.txt') {
        return new Response(ads, {
            headers: {
                'content-type': 'text/plain;charset=UTF-8'
            }
        });
    } else if (url.pathname.toLowerCase() == '/favicon.ico') {
        return fetch(网站图标);
    } else {
        // 先测速，不加载背景图片
        let img = 'https://raw.cmliussss.com/keqing1080p.jpg'; // 默认图片
        if (env.IMG) {
            const imgs = await ADD(env.IMG);
            img = imgs[Math.floor(Math.random() * imgs.length)];
        }

        // 生成将 urls 数组传递给前端 JavaScript 的 HTML
        const html = generateHtml(currentUrls, img, 网站图标, 网站头像, 网络备案, 网页标题, 站点名称, path, params);

        return new Response(html, {
            headers: { 'content-type': 'text/html;charset=UTF-8' }
        });
    }
}

// 辅助函数：将env.URLS字符串处理成数组
async function ADD(envadd) {
    // 将制表符、双引号、单引号和换行符都替换为逗号
    // 然后将连续的多个逗号替换为单个逗号
    var addtext = envadd.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');

    // 删除开头和结尾的逗号（如果有的话）
    if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
    if (addtext.charAt(addtext.length - 1) == ',') addtext = addtext.slice(0, addtext.length - 1);

    // 使用逗号分割字符串，得到地址数组
    const add = addtext.split(',');

    return add;
}

function generateHtml(urls, img, icon, avatar, beian, title, siteName, path, params) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName} - ${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #10b981;
            --primary-gradient: linear-gradient(135deg, #34d399 0%, #059669 100%);
            --glass-bg: rgba(255, 255, 255, 0.7);
            --glass-border: rgba(255, 255, 255, 0.5);
            --text-main: #1f2937;
            --text-secondary: #4b5563;
            --card-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            --item-bg: rgba(255, 255, 255, 0.6);
            --item-hover-bg: rgba(255, 255, 255, 0.9);
            --fastest-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 253, 244, 0.95));
            --fastest-border: #34d399;
            --fastest-shadow: rgba(16, 185, 129, 0.15);
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --glass-bg: rgba(17, 24, 39, 0.75);
                --glass-border: rgba(255, 255, 255, 0.1);
                --text-main: #f3f4f6;
                --text-secondary: #9ca3af;
                --card-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                --item-bg: rgba(31, 41, 55, 0.6);
                --item-hover-bg: rgba(31, 41, 55, 0.9);
                --fastest-bg: linear-gradient(135deg, rgba(6, 78, 59, 0.4), rgba(6, 95, 70, 0.4));
                --fastest-border: #059669;
                --fastest-shadow: rgba(16, 185, 129, 0.1);
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url('${img}');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            color: var(--text-main);
            overflow: hidden;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(3px);
            z-index: -1;
            transition: background 0.3s ease;
        }

        @media (prefers-color-scheme: dark) {
            body::before {
                background: rgba(0, 0, 0, 0.4);
            }
        }

        .container {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 32px;
            padding: 48px;
            width: 90%;
            max-width: 520px;
            box-shadow: var(--card-shadow);
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translateY(20px);
            opacity: 0;
            animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes slideUp {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .logo-wrapper {
            position: relative;
            width: 140px;
            height: 140px;
            margin-bottom: 32px;
        }

        .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 6px solid rgba(255, 255, 255, 0.8);
            object-fit: cover;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            transition: transform 0.5s ease;
        }

        .logo:hover {
            transform: scale(1.05) rotate(5deg);
        }

        .status-ring {
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: #10b981;
            border-right-color: #34d399;
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, var(--text-main) 0%, var(--text-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
        }

        .subtitle {
            font-size: 16px;
            color: var(--text-secondary);
            margin-bottom: 40px;
            font-weight: 400;
            text-align: center;
            letter-spacing: 0.5px;
        }

        .url-list {
            width: 100%;
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .url-item {
            background: var(--item-bg);
            padding: 16px 24px;
            border-radius: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid transparent;
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
            transform: translateX(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .url-item.fastest {
            background: var(--fastest-bg);
            border-color: var(--fastest-border);
            box-shadow: 0 8px 20px var(--fastest-shadow);
        }

        .url-name {
            font-weight: 600;
            font-size: 16px;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .url-latency {
            font-size: 14px;
            font-weight: 600;
            height: 28px;
            padding: 0 12px;
            border-radius: 14px;
            background: rgba(0, 0, 0, 0.05);
            min-width: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        @media (prefers-color-scheme: dark) {
            .url-latency {
                background: rgba(255, 255, 255, 0.1);
            }
        }

        .latency-good { color: #059669; background: #d1fae5; }
        .latency-fair { color: #d97706; background: #fef3c7; }
        .latency-poor { color: #dc2626; background: #fee2e2; }
        .latency-checking { color: #4b5563; background: rgba(0, 0, 0, 0.05); animation: pulse 1.5s infinite; }

        @media (prefers-color-scheme: dark) {
            .latency-good { color: #34d399; background: rgba(5, 150, 105, 0.2); }
            .latency-fair { color: #fbbf24; background: rgba(217, 119, 6, 0.2); }
            .latency-poor { color: #f87171; background: rgba(220, 38, 38, 0.2); }
            .latency-checking { color: #9ca3af; background: rgba(255, 255, 255, 0.1); }
        }

        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }

        .footer {
            margin-top: 32px;
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

        .github-corner {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 1000;
        }

        .github-corner svg {
            position: absolute;
            top: 0;
            right: 0;
            border: 0;
            fill: #6bdf8f;
            color: #ffffff;
            width: 80px;
            height: 80px;
            transition: fill 0.3s ease;
        }
        
        .github-corner:hover svg {
            fill: #5bc77d;
        }
        
        .github-corner .octo-arm {
            transform-origin: 130px 106px;
        }
        
        @keyframes octocat-wave {
            0%, 100% { transform: rotate(0) }
            20%, 60% { transform: rotate(-25deg) }
            40%, 80% { transform: rotate(10deg) }
        }
        
        .github-corner:hover .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
        }
        
        @media (max-width: 500px) {
            .github-corner {
                width: 60px;
                height: 60px;
            }
            .github-corner:hover .octo-arm {
                animation: none;
            }
            .github-corner .octo-arm {
                animation: octocat-wave 560ms ease-in-out;
            }
        }
    </style>
</head>
<body>
    <a href="https://github.com/cmliu/Blog-CDN-Gateway" target="_blank" class="github-corner" aria-label="View source on Github">
        <svg viewBox="0 0 250 250" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
        </svg>
    </a>
    <div class="container">
        <div class="logo-wrapper">
            <div class="status-ring"></div>
            <img class="logo" src="${avatar}" alt="Logo">
        </div>
        <h1>${title}</h1>
        <div class="subtitle">正在为您寻找最佳线路...</div>
        
        <ul class="url-list" id="urlList"></ul>

        <div class="footer">
            ${beian}
        </div>
    </div>

    <script>
        const urls = ${JSON.stringify(urls)};
        const currentPath = '${path}';
        const currentParams = '${params}';
        const list = document.getElementById('urlList');

        // Render Initial List
        urls.forEach((url, index) => {
            const [testUrl, name] = url.split('#');
            const li = document.createElement('li');
            li.className = 'url-item';
            li.id = \`item-\${index}\`;
            li.innerHTML = \`
                <span class="url-name">\${name}</span>
                <span class="url-latency latency-checking" id="latency-\${index}">测速中</span>
            \`;
            list.appendChild(li);
        });

        async function checkLatency(url) {
            const start = Date.now();
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                await fetch(url, { 
                    method: 'HEAD', 
                    mode: 'no-cors', 
                    signal: controller.signal,
                    cache: 'no-store'
                });
                clearTimeout(timeoutId);
                return Date.now() - start;
            } catch (error) {
                return 9999;
            }
        }

        async function runTests() {
            const results = await Promise.all(urls.map(async (urlStr, index) => {
                const [testUrl, name] = urlStr.split('#');
                const latency = await checkLatency(testUrl);
                return { index, name, testUrl, latency };
            }));

            // Update UI with results
            results.forEach(res => {
                const el = document.getElementById(\`latency-\${res.index}\`);
                el.classList.remove('latency-checking');
                el.textContent = res.latency === 9999 ? '超时' : \`\${res.latency}ms\`;
                
                if (res.latency < 200) el.classList.add('latency-good');
                else if (res.latency < 500) el.classList.add('latency-fair');
                else el.classList.add('latency-poor');
            });

            // Find fastest
            const validResults = results.filter(r => r.latency < 9999);
            if (validResults.length > 0) {
                const fastest = validResults.reduce((prev, curr) => 
                    prev.latency < curr.latency ? prev : curr
                );
                
                const fastestEl = document.getElementById(\`item-\${fastest.index}\`);
                fastestEl.classList.add('fastest');
                
                const subtitle = document.querySelector('.subtitle');
                subtitle.textContent = \`即将跳转至: \${fastest.name}\`;
                subtitle.style.color = '#10b981';

                // Redirect
                setTimeout(() => {
                    window.location.href = fastest.testUrl + currentPath + currentParams;
                }, 800);
            } else {
                 document.querySelector('.subtitle').textContent = '所有线路均不可用';
                 document.querySelector('.subtitle').style.color = '#dc2626';
            }
        }

        window.onload = runTests;
    </script>
</body>
</html>`;
}

