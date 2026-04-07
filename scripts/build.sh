#!/bin/bash

# ==========================================
# Docker 镜像构建脚本
# 支持多架构构建和版本管理
# ==========================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
IMAGE_NAME="react-umi-admin"
REGISTRY="${DOCKER_REGISTRY:-docker.io}"
NAMESPACE="${DOCKER_NAMESPACE:-your-namespace}"
VERSION="${VERSION:-latest}"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# 完整镜像名称
FULL_IMAGE_NAME="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}"

# 打印信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    print_info "Docker 版本: $(docker --version)"
}

# 清理旧的构建缓存
clean_cache() {
    print_info "清理 Docker 构建缓存..."
    docker builder prune -f --filter "until=24h" || true
}

# 构建镜像
build_image() {
    local platform="${1:-linux/amd64}"
    local push="${2:-false}"
    
    print_info "开始构建 Docker 镜像..."
    print_info "镜像名称: ${FULL_IMAGE_NAME}:${VERSION}"
    print_info "平台架构: ${platform}"
    print_info "Git Commit: ${GIT_COMMIT}"
    print_info "Git Branch: ${GIT_BRANCH}"
    
    # 构建参数
    BUILD_ARGS=(
        --build-arg "BUILD_DATE=${BUILD_DATE}"
        --build-arg "GIT_COMMIT=${GIT_COMMIT}"
        --build-arg "GIT_BRANCH=${GIT_BRANCH}"
        --build-arg "VERSION=${VERSION}"
        --platform "${platform}"
        --tag "${FULL_IMAGE_NAME}:${VERSION}"
        --tag "${FULL_IMAGE_NAME}:${GIT_COMMIT}"
    )
    
    # 如果是 latest 版本，添加 latest 标签
    if [ "${VERSION}" = "latest" ]; then
        BUILD_ARGS+=(--tag "${FULL_IMAGE_NAME}:latest")
    fi
    
    # 如果需要推送，添加 push 参数
    if [ "${push}" = "true" ]; then
        BUILD_ARGS+=(--push)
    else
        BUILD_ARGS+=(--load)
    fi
    
    # 执行构建
    docker buildx build "${BUILD_ARGS[@]}" .
    
    if [ $? -eq 0 ]; then
        print_info "镜像构建成功！"
        print_info "镜像标签:"
        echo "  - ${FULL_IMAGE_NAME}:${VERSION}"
        echo "  - ${FULL_IMAGE_NAME}:${GIT_COMMIT}"
        [ "${VERSION}" = "latest" ] && echo "  - ${FULL_IMAGE_NAME}:latest"
    else
        print_error "镜像构建失败！"
        exit 1
    fi
}

# 多架构构建
build_multiarch() {
    print_info "开始多架构构建..."
    
    # 创建并使用 buildx builder
    docker buildx create --name multiarch-builder --use 2>/dev/null || docker buildx use multiarch-builder
    docker buildx inspect --bootstrap
    
    # 构建多架构镜像
    build_image "linux/amd64,linux/arm64" "true"
    
    print_info "多架构镜像构建完成！"
}

# 推送镜像
push_image() {
    print_info "推送镜像到仓库..."
    
    docker push "${FULL_IMAGE_NAME}:${VERSION}"
    docker push "${FULL_IMAGE_NAME}:${GIT_COMMIT}"
    
    if [ "${VERSION}" = "latest" ]; then
        docker push "${FULL_IMAGE_NAME}:latest"
    fi
    
    print_info "镜像推送成功！"
}

# 扫描镜像安全漏洞
scan_image() {
    print_info "扫描镜像安全漏洞..."
    
    if command -v trivy &> /dev/null; then
        trivy image "${FULL_IMAGE_NAME}:${VERSION}"
    else
        print_warn "Trivy 未安装，跳过安全扫描"
        print_warn "建议安装 Trivy: https://github.com/aquasecurity/trivy"
    fi
}

# 显示镜像信息
show_image_info() {
    print_info "镜像信息:"
    docker images "${FULL_IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
}

# 显示帮助信息
show_help() {
    cat << EOF
Docker 镜像构建脚本

用法:
    ./scripts/build.sh [选项]

选项:
    -h, --help              显示帮助信息
    -v, --version VERSION   指定版本号 (默认: latest)
    -p, --push              构建后推送到仓库
    -m, --multiarch         多架构构建 (amd64 + arm64)
    -s, --scan              构建后扫描安全漏洞
    -c, --clean             清理构建缓存

示例:
    # 构建本地镜像
    ./scripts/build.sh

    # 构建并推送到仓库
    ./scripts/build.sh -v 1.0.0 -p

    # 多架构构建并推送
    ./scripts/build.sh -v 1.0.0 -m

    # 构建并扫描安全漏洞
    ./scripts/build.sh -s

环境变量:
    DOCKER_REGISTRY         Docker 仓库地址 (默认: docker.io)
    DOCKER_NAMESPACE        Docker 命名空间 (默认: your-namespace)
    VERSION                 镜像版本号 (默认: latest)

EOF
}

# 主函数
main() {
    local push=false
    local multiarch=false
    local scan=false
    local clean=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                VERSION="$2"
                shift 2
                ;;
            -p|--push)
                push=true
                shift
                ;;
            -m|--multiarch)
                multiarch=true
                push=true
                shift
                ;;
            -s|--scan)
                scan=true
                shift
                ;;
            -c|--clean)
                clean=true
                shift
                ;;
            *)
                print_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 检查环境
    check_docker
    
    # 清理缓存
    if [ "${clean}" = "true" ]; then
        clean_cache
    fi
    
    # 构建镜像
    if [ "${multiarch}" = "true" ]; then
        build_multiarch
    else
        build_image "linux/amd64" "${push}"
        
        # 推送镜像
        if [ "${push}" = "true" ]; then
            push_image
        fi
    fi
    
    # 安全扫描
    if [ "${scan}" = "true" ]; then
        scan_image
    fi
    
    # 显示镜像信息
    show_image_info
    
    print_info "构建完成！"
}

# 执行主函数
main "$@"
