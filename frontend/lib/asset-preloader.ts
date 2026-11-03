// Asset preloading helper to guarantee background content loads while loader is on screen

const loadedImages = new Set<string>();
const loadedVideos = new Set<string>();

export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !src) {
      return resolve(true);
    }
    if (loadedImages.has(src)) {
      return resolve(true);
    }
    const img = new Image();
    img.src = src;
    if (img.complete) {
      loadedImages.add(src);
      return resolve(true);
    }
    img.onload = () => {
      loadedImages.add(src);
      resolve(true);
    };
    img.onerror = () => {
      // Don't halt progress on a single missing image
      resolve(false);
    };
  });
}

export function preloadVideo(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !src) {
      return resolve(true);
    }
    if (loadedVideos.has(src)) {
      return resolve(true);
    }
    const video = document.createElement("video");
    video.src = src;
    video.preload = "auto";
    video.muted = true;

    let resolved = false;
    const finish = (ok: boolean) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      if (ok) loadedVideos.add(src);
      resolve(ok);
    };

    const cleanup = () => {
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };

    const onReady = () => finish(true);
    const onError = () => finish(false);

    video.addEventListener("canplay", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });

    if (video.readyState >= 2) {
      finish(true);
      return;
    }

    // Safety timeout per video so loader never hangs
    setTimeout(() => finish(true), 2500);
  });
}

export const ROUTE_CRITICAL_ASSETS: Record<
  string,
  { images?: string[]; videos?: string[] }
> = {
  "/": {
    images: [
      "/hero-backup/axminster.webp",
      "/hero-backup/axminster-2.webp",
      "/why_loomstone.png",
    ],
    videos: ["/why_loomstone.mp4"],
  },
  "/about": {
    images: ["/story.webp", "/founder.webp"],
  },
  "/products": {
    images: ["/product.webp"],
  },
  "/clientele": {
    images: [
      "/clients/marriott.webp",
      "/clients/hilton.webp",
      "/clients/hyatt.webp",
      "/clients/itc.png",
      "/clients/leela.webp",
      "/clients/dlf.webp",
    ],
  },
  "/inspiration": {
    images: ["/inspiration/1.jpeg", "/inspiration/2.png"],
  },
  "/blogs": {
    images: [],
  },
  "/contact": {
    images: [],
  },
  "/brochure": {
    images: [],
  },
};

export async function preloadRoute(
  pathname: string,
  onProgress?: (percent: number) => void,
  timeoutMs = 2800
): Promise<void> {
  const cleanPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const assets = ROUTE_CRITICAL_ASSETS[cleanPath] || {
    images: [],
    videos: [],
  };

  const images = assets.images || [];
  const videos = assets.videos || [];
  const total = images.length + videos.length;

  if (total === 0) {
    if (onProgress) onProgress(100);
    return;
  }

  let completed = 0;
  const update = () => {
    completed++;
    if (onProgress) {
      const pct = Math.round(30 + (completed / total) * 65);
      onProgress(Math.min(95, pct));
    }
  };

  const tasks: Promise<boolean>[] = [
    ...images.map((img) =>
      preloadImage(img).then((res) => {
        update();
        return res;
      })
    ),
    ...videos.map((vid) =>
      preloadVideo(vid).then((res) => {
        update();
        return res;
      })
    ),
  ];

  const safetyTimeout = new Promise<void>((resolve) =>
    setTimeout(resolve, timeoutMs)
  );

  await Promise.race([Promise.all(tasks), safetyTimeout]);
  if (onProgress) onProgress(100);
}
