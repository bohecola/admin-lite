import SparkMD5 from "spark-md5";

// 接受主进程发送过来的数据
self.onmessage = function (e) {
	const { chunks } = e.data;
	// 计算整个文件哈希
	getFileHash(chunks)
		.then((hash) => {
			// 发送哈希值给主进程
			self.postMessage({ hash });
		})
		.catch((error) => {
			// 发送错误信息给主进程
			self.postMessage({ error });
		});
};

// 计算整个文件哈希
async function getFileHash(chunks) {
	// 创建 SparkMD5 对象
	const spark = new SparkMD5.ArrayBuffer();
	// 读取每个 chunk 内容
	const promises = chunks.map(({ chunk }) => {
		return getChunkContent(chunk);
	});

	try {
		// 等待所有 chunk 内容读取完成
		const contents = await Promise.all(promises);
		// 将所有 chunk 内容添加到 spark 对象中
		contents.forEach((content) => {
			spark.append(content);
		});
		// 计算哈希值
		const hash = spark.end();
		// 返回哈希值
		return hash;
	} catch (error) {
		console.log(error);
	}
}

// 读取 chunk 内容
function getChunkContent(chunk) {
	return new Promise((resolve, reject) => {
		// 创建 FileReader 对象
		const reader = new FileReader();

		// 读取文件内容
		reader.readAsArrayBuffer(chunk);

		// 读取成功后的回调
		reader.onload = function (e) {
			resolve(e.target.result);
		};

		// 读取失败后的回调
		reader.onerror = function () {
			reject(reader.error);
			reader.abort();
		};
	});
}
