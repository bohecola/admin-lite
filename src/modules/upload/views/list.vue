<script setup name="upload-list">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { isEmpty, floor } from "lodash-es";
import axios from "axios";
import { useCool } from "/@/cool";
import { handleFileSlice, calculateHash, changePercentage, get100 } from "../utils";

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

// 取消请求源 数组
const sources = ref([]);

// 暂停
const pasue = ref(false);

// 预览地址
const url = ref("");

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
		return floor(loaded / uploadFile.value.size);
	}

	return 0;
});

// 开始上传
async function startUpload() {
	// 验证文件是否已经上传过
	const { shouldUpload, url: fileURL, uploadedList } = await verify();

	let promises = [];

	// 文件秒传
	if (!shouldUpload) {
		changePercentage(chunks.value, get100());
		url.value = fileURL;
	} else {
		// 存在上传的切片
		if (!isEmpty(uploadedList)) {
			const unUploaded = [];
			// 过滤出未上传的切片
			chunks.value.forEach((chunk) => {
				if (uploadedList.includes(chunk.hash)) {
					// 有些切片上传上去了，但是请求取消了，导致上传进度监听没有被及时触发
					// 从而导致切片上传进度没有更新，例如最终进度可能停留在73%
					// 但是实际上切片已经上传完成了
					// 所以这里需要将已上传的切片进度重置为100%，保证上传进度的准确性
					chunk.percentage = get100();
				} else {
					// 未上传的切片
					unUploaded.push(chunk);
				}
			});

			// 未上传切片请求
			promises = getChunkReqs(unUploaded);
			// 不存在上传文件和已上传的切片
		} else {
			// 重置进度为0，防止上次上传的进度影响
			changePercentage(chunks.value, 0);
			// 上传切片请求
			promises = getChunkReqs(chunks.value);
		}

		// 全部上传
		await Promise.all(promises);

		// 合并文件
		const { url: fileURL } = await service.comm.mergeChunk({
			fileHash: hash.value,
			fileName: uploadFile.value.name,
			splitSize: defaultChunkSize,
			total: chunks.value.length
		});

		url.value = fileURL;
	}

	ElMessage.success("上传成功");
}

// 选择文件
function handleFileChange(e) {
	// 重置状态
	resetState();
	// 获取文件
	uploadFile.value = e.target.files[0];
}

// 开始切片
async function startSlice() {
	// 切片文件是否存在
	if (!isEmpty(chunks.value)) {
		return ElMessage.warning("切片已存在");
	}

	// 进行切片
	const startSlice = performance.now();
	const _chunks = handleFileSlice(uploadFile.value, defaultChunkSize);
	const endSlice = performance.now();
	console.log("切片耗时：", endSlice - startSlice, "ms");

	// 计算哈希
	const startHash = performance.now();
	hash.value = await calculateHash(_chunks);
	const endHash = performance.now();
	console.log("计算哈希耗时：", endHash - startHash, "ms");

	// 切片属性增强
	chunks.value = enhanceChunks(_chunks, {
		file: uploadFile.value,
		hash: hash.value,
		chunkSize: defaultChunkSize
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

// 切片请求数组
function getChunkReqs(chunks) {
	return chunks.map((enhancedChunk) => {
		// chunk 属性
		const { fileHash, hash, chunk } = enhancedChunk;
		// 创建 FormData 对象
		const formData = new FormData();
		// 文件哈希
		formData.append("fileHash", fileHash);
		// 切片哈希
		formData.append("hash", hash);
		// 切片
		formData.append("chunk", chunk);

		// 取消令牌源
		const source = axios.CancelToken.source();

		// 收集取消令牌源
		sources.value.push(source);

		// 上传请求
		return service.comm.uploadChunk(formData, {
			// 取消令牌
			cancelToken: source.token,
			// 监听上传进度
			onUploadProgress: (progressEvent) => {
				if (progressEvent.lengthComputable) {
					// 上传进度
					const progress = floor((progressEvent.loaded / progressEvent.total) * 100 | 0);
					// 更新进度
					enhancedChunk.percentage = progress;
				}
			}
		}).then(() => {
			// 上传成功，查找请求成功的<取消令牌源>的索引
			const sourceIndex = sources.value.findIndex((item) => item === source);
			// 移除请求成功的<取消令牌源>
			sources.value.splice(sourceIndex, 1);
		});
	});
}

// 验证文件是否已经上传过
function verify() {
	return service.comm
		.uploadVerify({
			fileHash: hash.value,
			fileName: uploadFile.value.name
		});
}

// 暂停上传
function handlePause() {
	// 切换暂停状态
	pasue.value = !pasue.value;

	if (pasue.value) {
		// 暂停
		sources.value.forEach((source) => source.cancel());
		sources.value = [];
	} else {
		// 继续
		startUpload();
	}
}

// 全部重置
function resetAll() {
	// 获取 input 元素
	const input = document.querySelector("input[type=file]");
	// 重置 input 元素
	input.value = "";
	// 重置状态
	resetState();
}

// 重置状态
function resetState() {
	// 重置文件
	uploadFile.value = null;
	// 重置哈希
	hash.value = "";
	// 重置切片数组
	chunks.value = [];
	// 重置取消令牌源
	sources.value = [];
	// 重置暂停状态
	pasue.value = false;
	// 重置文件地址
	url.value = "";
}
</script>

<template>
  <div class="page-test">
    <h1 class="mb-2">切片上传 | 断点续传 | 文件秒传 </h1>

    <input
      class="block mb-3"
      type="file"
      @change="handleFileChange"
    >

    <div class="flex gap-1">
      <button
        class="px-2 cursor-pointer disabled:cursor-not-allowed"
        :disabled="!Boolean(uploadFile)"
        @click="startSlice">
        切片
      </button>

      <button
        class="px-2 cursor-pointer disabled:cursor-not-allowed"
        :disabled="!Boolean(hash)"
        @click="startUpload">
        上传
      </button>

      <button
        class="px-2 cursor-pointer disabled:cursor-not-allowed"
        :disabled="!Boolean(hash)"
        @click="handlePause">
        {{ pasue ? '继续' : '暂停' }}
      </button>

      <button
        class="px-2 cursor-pointer"
        @click="resetAll">
        重置
      </button>
    </div>

    <div class="my-5 flex flex-wrap gap-4">
      <div
        class="w-40 h-40 p-2 rounded border border-gray-400 text-center text-sm flex flex-col gap-1 justify-center"
        v-for="(chunk, index) in chunks"
        :key="index">
        <!-- chunk 哈希 -->
        <div class="p-1 rounded break-all bg-slate-200 text-gray-500">
          chunk-hash：{{ chunk.hash }}
        </div>
        <!-- 切片大小 -->
        <div class=" text-stone-600">Byte：{{ chunk.size }}</div>
        <!-- 进度数值 -->
        <p class=" text-lime-600">Percentage：{{ chunk.percentage }}%</p>
        <!-- chunk 进度条 -->
        <div class="h-[6px] border border-cyan-900 rounded">
          <div
            class="h-1 bg-cyan-900/60 rounded"
            :style="{ width: `${chunk.percentage}%` }"
          />
        </div>
      </div>
    </div>

    <!-- 文件名 -->
    <div v-if="hash" class="mb-2">
      <span class="p-1 text-sm text-gray-800 bg-sky-600 mr-1">
        文件哈希：{{ hash }}
      </span>
      <span class="p-1 text-sm text-gray-800 bg-sky-600">
        格式：{{ uploadFile.name.split('.')[1] }}
      </span>
    </div>

    <video
      v-if="url"
      :src="url"
      preload="auto"
      width="350"
      class="mb-2"
      controls
    />
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
.page-test {
  min-height: 100%;
  padding: 10px;
  background: #fff;
}
</style>
