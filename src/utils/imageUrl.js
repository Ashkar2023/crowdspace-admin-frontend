export const buildImageUrl = (img_url = "") => {
    return new URL(img_url, import.meta.env.VITE_MINIO_URL);
}


export const getFallbackImage = (imgFor) => {
    const urls = {
        "post": "/defaults/1479.gif",
        "user": "/defaults/user.png",
    }

    return new URL(urls[imgFor], import.meta.env.VITE_MINIO_URL);
}