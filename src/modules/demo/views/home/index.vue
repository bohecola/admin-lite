<script setup>
import { computed, ref } from "vue";
import { useCool } from "/@/cool";
import { isEmpty } from "lodash-es";

// worker
const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

// 文件切片大小 2M
const defaultChunkSize = 1024 * 1024 * 2;

// 服务
const { service } = useCool();

// 上传的文件
const uploadFile = ref(null);

// 切片数组
const chunks = ref([]);

// 文件哈希
const hash = ref("");

// chunks 是否被增强
const isEnhanced = computed(() => {
	return !isEmpty(chunks.value) && !isEmpty(chunks.value[0].fileHash);
});

// 总进度
const totalProgress = computed(() => {
	if (isEnhanced.value) {
		const loaded = chunks.value
			.map(({ size, percentage }) => size * percentage)
			.reduce((prev, curr) => prev + curr, 0);

		// 总进度
		return (loaded / uploadFile.value.size).toFixed(2);
	}

	return Number(0).toFixed(2);
});

// 开始上传
async function startUpload() {
	// 上传切片请求
	const promises = chunks.value.map((enhancedChunk) => {
		// chunk 属性
		const { fileHash, hash, chunk, index } = enhancedChunk;
		// 创建 formData 对象
		const formData = new FormData();
		// 文件哈希
		formData.append("fileHash", fileHash);
		// 切片哈希
		formData.append("hash", hash);
		// 切片
		formData.append("chunk", chunk);
		// 上传请求
		return service.comm.uploadChunk(formData, (progressEvent) => {
			// 监听上传进度
			if (progressEvent.lengthComputable) {
				// 切片上传进度
				const progress = ((progressEvent.loaded / progressEvent.total) * 100 | 0).toFixed(2);
				// 更新进度
				chunks.value[index].percentage = progress;
			}
		});
	});

	// 全部上传
	await Promise.all(promises);

	// 合并文件
	await service.comm.mergeChunk({
		fileHash: hash.value,
		fileName: uploadFile.value.name,
		splitSize: defaultChunkSize,
		total: chunks.value.length
	});
}

// 选择文件
async function handleFileChange(e) {
	// 重置状态
	resetState();
	// 获取文件
	uploadFile.value = e.target.files[0];

	// 进行切片
	const _chunks = handleFileSlice(uploadFile.value, defaultChunkSize);

	// 计算哈希
	hash.value = await calculateHash(_chunks);

	// 增强切片属性
	chunks.value = enhanceChunks(_chunks, {
		file: uploadFile.value,
		hash: hash.value,
		chunkSize: defaultChunkSize
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

// 增强 chunks
function enhanceChunks(chunks, meta) {
	// 元数据
	const { hash, file, chunkSize } = meta;

	// 给切片对象添加属性
	return chunks.map(({ chunk }, index) => {
		return {
			// 1. 文件哈希
			fileHash: hash,
			// 2. 切片索引
			index,
			// 3. 切片总数
			total: chunks.length,
			// 4. 文件总大小
			totalSize: file.size,
			// 5. 当前切片的哈希
			hash: `${hash}-${index}`,
			// 6. 切片对象
			chunk,
			// 7. 切片大小
			size: chunk.size,
			// 8. 分割大小
			splitSize: chunkSize,
			// 9. 文件名
			fileName: file.name,
			// 10. 上传进度
			percentage: 0
		};
	});
}

// 全部重置
function resetAll() {
	// 获取 input 元素
	const input = document.querySelector("input[type=file]");
	// 重置 input 元素
	input.value = "";

	resetState();
}

// 重置状态
function resetState() {
	// 重置文件
	uploadFile.value = null;

	// 重置切片数组
	chunks.value = [];

	// 重置哈希
	hash.value = "";
}
</script>

<template>
  <div class="page-home">
    <h1 class="mb-2">切片上传、断点续传</h1>

    <input
      class="block mb-3"
      type="file"
      @change="handleFileChange"
    >

    <div class="flex gap-1">
      <button
        class="px-2 cursor-pointer"
        @click="startUpload">
        上传
      </button>

      <button
        class="px-2 cursor-pointer"
        @click="resetAll">
        重置
      </button>
    </div>

    <hr class="my-5">

    <div class="flex flex-wrap gap-4">
      <div
        class="w-36 h-36 p-2 rounded border border-gray-600 text-center text-sm flex flex-col gap-1"
        v-for="(chunk, index) in chunks"
        :key="index">
        <!-- chunk 哈希 -->
        <div class="p-1 rounded break-all bg-slate-200 text-gray-500">哈希：{{ chunk.hash }}</div>
        <!-- 切片大小 -->
        <div class=" text-stone-600">字节：{{ chunk.size }}</div>
        <!-- 进度数值 -->
        <p class=" text-lime-600">进度：{{ chunk.percentage }}%</p>
        <!-- chunk 进度条 -->
        <div class="h-[6px] border border-cyan-900 rounded">
          <div
            class="h-1 bg-cyan-900/60 rounded"
            :style="{ width: `${chunk.percentage}%` }"
          />
        </div>
      </div>
    </div>

    <hr class="my-5">

    <!-- 总进度 -->
    <div class="h-[14px] rounded-lg border border-cyan-900 mb-2">
      <div
        class="h-3 bg-cyan-900/50 rounded-lg"
        :style="{ width: `${totalProgress}%` }"
      />
    </div>

    <div>总进度：{{ totalProgress }}%</div>
  </div>
</template>

<style lang="scss" scoped>
.page-home {
  height: 100%;
  padding: 10px;
  background: #fff;
}
</style>
