// 获取 100
export const get100 = () => 100;

// 文件切片
export function handleFileSlice(file, chunkSize) {
	// 切片数组
	const chunks = [];
	// 切片开始位置
	let start = 0;
	// 循环切片
	while (start < file.size) {
		// 切片结束位置
		const end = Math.min(start + chunkSize, file.size);
		// 切片
		const chunk = file.slice(start, end);
		// 添加切片
		chunks.push({ chunk });
		// 前进
		start += chunkSize;
	}
	// 返回切片数组
	return chunks;
}

// worker
const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

// 计算文件哈希
export function calculateHash(chunks) {
	return new Promise((resolve, reject) => {
		// 发送消息
		worker.postMessage({ chunks });
		// 接收消息
		worker.onmessage = (e) => {
			// 哈希
			const { hash } = e.data;
			if (hash) {
				// 哈希计算完成
				resolve(hash);
			}
		};
		// 错误处理
		worker.onerror = reject;
	});
}

// 修改进度
export function changePercentage(chunks, value) {
	chunks.forEach((chunk) => {
		if (Reflect.has(chunk, "percentage")) {
			chunk.percentage = value;
		}
	});
}

// 并发控制器
export function taskControll(list, max = 4, cb, isAbort) {
	let runIdx = 0;
	let finished = 0;

	const run = () => {
		while(max && runIdx < list.length) {
			// 中断
			if (isAbort.value) return;

			const task = list[runIdx];
			runIdx++;

			if (task) {
				max--;
				task().finally(() => {
					max++;
					finished++;

					if (finished === list.length) {
						cb();
					} else {
						run();
					}
				});
			}
		}
	};
	run();
}
