class NetworkUtils {
    static isOnline() {
        if ('onLine' in navigator) {
            return navigator.onLine;
        } else {
            console.warn('当前浏览器不支持 navigator.onLine。');
            return false;
        }
    }

    static getNetworkStatus() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            const type = connection.type;
            const downlink = connection.downlink;
            const effectiveType = connection.effectiveType;

            return { type, downlink, effectiveType };
        } else {
            console.warn('当前浏览器不支持 Navigator.connection 接口。');
            return null;
        }
    }

    static addOnlineListener(callback) {
        if ('onLine' in navigator) {
            window.addEventListener("online", callback);
        } else {
            console.warn('当前浏览器不支持 online 事件。');
        }
    }

    static addOfflineListener(callback) {
        if ('onLine' in navigator) {
            window.addEventListener("offline", callback);
        } else {
            console.warn('当前浏览器不支持 offline 事件。');
        }
    }

    static async measureDownlinkSpeed(url, duration = 5000) {
        if (!('fetch' in window)) {
            console.warn('当前浏览器不支持 Fetch API。');
            return null;
        }

        const startTime = performance.now();
        let downloadedBytes = 0;
        let finished = false;

        setTimeout(() => {
            finished = true;
        }, duration);

        try {
            while (!finished) {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Network response was not ok");
                const dataBlob = await response.blob();
                downloadedBytes += dataBlob.size;
            }

            const endTime = performance.now();
            const elapsedSeconds = (endTime - startTime) / 1000;
            const downlinkSpeed = (downloadedBytes * 8) / elapsedSeconds / 1e6; // Convert to Mbps

            return downlinkSpeed;
        } catch (error) {
            console.error('Error measuring downlink speed:', error);
            return null;
        }
    }

    static async measureUplinkSpeed(url, blobSize, duration = 5000) {
        if (!('fetch' in window)) {
            console.warn('当前浏览器不支持 Fetch API。');
            return null;
        }

        const startTime = performance.now();
        let uploadedBytes = 0;
        let finished = false;

        setTimeout(() => {
            finished = true;
        }, duration);

        try {
            const randomData = new Uint8Array(blobSize);
            crypto.getRandomValues(randomData);
            const dataBlob = new Blob([randomData]);

            while (!finished) {
                const response = await fetch(url, {
                    method: 'POST',
                    body: dataBlob
                });

                if (!response.ok) throw new Error("Network response was not ok");
                uploadedBytes += dataBlob.size;
            }

            const endTime = performance.now();
            const elapsedSeconds = (endTime - startTime) / 1000;
            const uplinkSpeed = (uploadedBytes * 8) / elapsedSeconds / 1e6; // Convert to Mbps

            return uplinkSpeed;
        } catch (error) {
            console.error('Error measuring uplink speed:', error);
            return null;
        }
    }
}


// 使用 NetworkUtils 类

// 检测是否联网
const onlineStatus = NetworkUtils.isOnline();
console.log("设备" + (onlineStatus ? "已联网" : "未联网"));

// 获取网络状态
const networkStatus = NetworkUtils.getNetworkStatus();
if (networkStatus) {
    console.log(`网络类型: ${networkStatus.type}`);
    console.log(`下载速度: ${networkStatus.downlink} Mbps`);
    console.log(`有效网络类型: ${networkStatus.effectiveType}`);
} else {
    console.log("无法获取网络状态");
}

// 添加在线/离线事件监听
NetworkUtils.addOnlineListener(() => {
    console.log("设备已联网");
});

NetworkUtils.addOfflineListener(() => {
    console.log("设备未联网");
});


(async () => {
    const testUrl = 'https://example.com/test-file'; // 替换为合适的测试 URL
    const testDuration = 5000; // 测试时长，单位：毫秒
    const blobSize = 1024 * 1024; // 上传测试时使用的 Blob 大小，单位：字节

    // 测量下载速度
    const downlinkSpeed = await NetworkUtils.measureDownlinkSpeed(testUrl, testDuration);
    if (downlinkSpeed) {
        console.log(`下载速度: ${downlinkSpeed.toFixed(2)} Mbps`);
    } else {
        console.log('无法测量下载速度');
    }

    // 测量上传速度
    const uplinkSpeed = await NetworkUtils.measureUplinkSpeed(testUrl, blobSize, testDuration);
    if (uplinkSpeed) {
        console.log(`上传速度: ${uplinkSpeed.toFixed(2)} Mbps`);
    } else {
        console.log('无法测量上传速度');
    }
})();
