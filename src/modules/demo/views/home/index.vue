<script setup>
import { ref } from "vue";
import { useCool } from "/@/cool";

// worker
const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

// 文件切片大小 2M
const defaultChunkSize = 1024 * 1024 * 2;

// 服务
const { service } = useCool();

// 文件
const uploadFile = ref(null);

// 开始上传
async function startUpload() {
	// 选择上传的文件
	const file = uploadFile.value;

	// 对文件进行切片
	const chunks = handleFileSlice(file, defaultChunkSize);

	// 计算整个文件哈希
	const hash = await calculateHash(chunks);

	// 上传切片请求
	const promises = chunks.map(({ chunk }, index) => {
		// 创建 formData 对象
		const formData = new FormData();
		// 整个文件的哈希
		formData.append("fileHash", hash);
		// 当前切片的索引
		formData.append("index", index);
		// 切片总数
		formData.append("total", chunks.length);
		// 文件总大小
		formData.append("totalSize", file.size);
		// 当前切片的哈希
		formData.append("hash", `${hash}-${index}`);
		// 当前切片
		formData.append("chunk", chunk);
		// 当前切片大小
		formData.append("size", chunk.size);
		// 切片大小
		formData.append("splitSize", defaultChunkSize);
		// 文件名
		formData.append("fileName", file.name);
		return service.comm.uploadChunk(formData);
	});

	// 全部上传
	await Promise.all(promises);

	// 合并文件
	await service.comm.mergeChunk({
		fileHash: hash,
		fileName: file.name,
		splitSize: defaultChunkSize,
		total: chunks.length
	});
}

// 文件切片
function handleFileSlice(file, chunkSize) {
	// 切片数组
	const chunks = [];
	// 切片开始位置
	let start = 0;
	// 循环切片
	while (start < file.size) {
		// 切片结束位置
		const end = start + chunkSize > file.size ? file.size : start + chunkSize;
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

// 计算文件哈希
function calculateHash(chunks) {
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

// 选择文件
function handleFileChange(e) {
	uploadFile.value = e.target.files[0];
}
</script>

<template>
  <div class="page-home">
    <h1 class="mb-2">切片上传、断点续传</h1>

    <input
      class="block mb-2"
      type="file"
      @change="handleFileChange"
    >

    <el-button
      type="primary"
      @click="startUpload">
      上传
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.page-home {
  height: 100%;
  padding: 10px;
  background: #fff;
}
</style>
