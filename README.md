# 示例项目

## 技术栈

1. **FE:** Vue3.0
2. **BFF:** Typegraphql
3. **Server:** Nodejs MongoDb Redis
4. **infrastructure:** Kubernetes Docker Istio
5. **Developer:** vscode Docker container
6. **Cloud:** Google Cloud Kubernetes Engine

## 开发

1. mac 安装 docker，打开 vscode，通过左下角 Dev Container 开启 docker 开发环境
   1. 首次安装，先 build 镜像 `docker build -t dev:v1 .`
   2. 开启 docker 环境后，根据提示安装远程 vscode 插件

## 部署

1. m1 机器默认生成 arm 镜像，云端机器一般是 amd64 环境，需要通过 buildx 命令生成 amd64 镜像并上传

   1. `docker buildx build --platform linux/amd64,linux/arm64 --push -t us-central1-docker.pkg.dev/wood-378110/wood/game-amd64:v3 .   `
   2. 在子 repo 执行并上传，vue 层比较特殊，为了节省时间，在本地执行 pnpm build 打包，然后在跟目录执行：`docker buildx build -f Dockerfile-vue --platform linux/amd64,linux/arm64 --push -t us-central1-docker.pkg.dev/wood-378110/wood/vue-amd64:v6 .`

2. 部署 istio

   1. `istioctl install --set profile=demo`。[安装地址](https://istio.io/latest/zh/docs/setup/install/istioctl/)

   2. 如果需要配置 skywalking，执行：istioctl upgrade --set profile=demo -f tracing.yaml

      1. 或者 1、2 步骤合并：`istioctl install --set profile=demo -f tracing.yaml`

      2. 配置打点频率：

         ```shell
         kubectl apply -f - <<EOF
         apiVersion: telemetry.istio.io/v1alpha1
         kind: Telemetry
         metadata:
           name: mesh-default
           namespace: istio-system
         spec:
           tracing:
           - randomSamplingPercentage: 100.00
         EOF
         ```

3. 执行 kubectl 部署服务：`kubectl apply -f deploy.yaml`，需要登录 pod 操作可以执行：`kubectl exec --stdin --tty bff-v1-7fd5b4889c-z67cm -- /bin/sh`

4. 配置网关、VirtualService、DestinationRule。注意这里不用 HTTPRoute 方案

   1. `kubectl apply -f gateway.yaml`
   2. kubectl apply -f vs.yaml
   3. `kubectl apply -f dr.yaml`

5. 配置可视化：

   1. `kubectl apply -f ./addons/`
   2. `kubectl apply -f ./addons/extras/skywalking.yaml`

## 可视化

[可视化参考](https://istio.io/latest/zh/docs/tasks/observability/)

1. `istioctl dashboard skywalking`
2. `istioctl dashboard kiali`
