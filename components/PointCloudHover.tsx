import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

interface HoverRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PointCloudHoverState {
  rect: HoverRect;
  src: string;
  imageElement: HTMLImageElement | null;
}

interface PointCloudHoverProps {
  hoverState: PointCloudHoverState | null;
}

const SAMPLE_COLS = 46;
const SAMPLE_ROWS = 46;

interface SamplingImage {
  image: HTMLImageElement;
  cleanup?: () => void;
}

const resolvedUrlCache = new Map<string, string | null>();

const loadImageElement = (src: string, useCrossOrigin: boolean) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    if (useCrossOrigin) {
      image.crossOrigin = "anonymous";
    }
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image load failed"));
    image.src = src;
  });
};

const toCoveredDrawRect = (
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number,
) => {
  const scale = Math.max(targetWidth / imageWidth, targetHeight / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const dx = (targetWidth - drawWidth) / 2;
  const dy = (targetHeight - drawHeight) / 2;
  return { dx, dy, drawWidth, drawHeight };
};

const isRedirectingUnsplashUrl = (src: string): boolean => {
  try {
    const url = new URL(src);
    return url.hostname === "unsplash.com" || url.hostname === "source.unsplash.com";
  } catch {
    return false;
  }
};

const resolveRedirectedUnsplashUrl = async (src: string): Promise<string | null> => {
  const normalized = src.trim();
  if (!normalized || !isRedirectingUnsplashUrl(normalized)) {
    return null;
  }
  if (resolvedUrlCache.has(normalized)) {
    return resolvedUrlCache.get(normalized) ?? null;
  }

  try {
    const response = await fetch(normalized, {
      mode: "no-cors",
      redirect: "follow",
      credentials: "omit",
      cache: "force-cache",
    });
    const finalUrl = response.url?.trim() ?? "";
    const resolved =
      finalUrl.length > 0 && finalUrl !== normalized && finalUrl.includes("images.unsplash.com")
        ? finalUrl
        : null;
    resolvedUrlCache.set(normalized, resolved);
    return resolved;
  } catch {
    resolvedUrlCache.set(normalized, null);
    return null;
  }
};

const loadImageFromFetchedBlob = async (src: string): Promise<SamplingImage> => {
  const response = await fetch(src, {
    mode: "cors",
    credentials: "omit",
    cache: "force-cache",
  });
  if (!response.ok) {
    throw new Error("Fetch failed");
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("Empty image blob");
  }

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await loadImageElement(objectUrl, false);
    return {
      image,
      cleanup: () => {
        URL.revokeObjectURL(objectUrl);
      },
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
};

const samplePixels = (
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
): Uint8ClampedArray => {
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = SAMPLE_COLS;
  sampleCanvas.height = SAMPLE_ROWS;
  const context = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Unable to initialize canvas context");
  }

  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight || !targetWidth || !targetHeight) {
    throw new Error("Invalid image size");
  }

  const { dx, dy, drawWidth, drawHeight } = toCoveredDrawRect(
    sourceWidth,
    sourceHeight,
    SAMPLE_COLS,
    SAMPLE_ROWS,
  );

  context.clearRect(0, 0, SAMPLE_COLS, SAMPLE_ROWS);
  context.drawImage(image, dx, dy, drawWidth, drawHeight);
  return context.getImageData(0, 0, SAMPLE_COLS, SAMPLE_ROWS).data;
};

const resolveSamplePixels = async (
  imageElement: HTMLImageElement | null,
  src: string,
  width: number,
  height: number,
): Promise<Uint8ClampedArray> => {
  const uniqueSources = new Set<string>();
  const normalizedSrc = src.trim();
  if (normalizedSrc.length > 0) {
    uniqueSources.add(normalizedSrc);
  }
  const currentSrc = imageElement?.currentSrc?.trim();
  if (currentSrc && currentSrc.length > 0) {
    uniqueSources.add(currentSrc);
  }

  const candidates: Array<() => Promise<SamplingImage>> = [];
  if (imageElement && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
    candidates.push(async () => ({ image: imageElement }));
  }

  uniqueSources.forEach((candidateSrc) => {
    candidates.push(() => loadImageFromFetchedBlob(candidateSrc));
  });

  uniqueSources.forEach((candidateSrc) => {
    candidates.push(async () => {
      const redirected = await resolveRedirectedUnsplashUrl(candidateSrc);
      if (!redirected) {
        throw new Error("No redirected URL");
      }
      return loadImageFromFetchedBlob(redirected);
    });
  });

  if (normalizedSrc.length > 0) {
    candidates.push(async () => ({ image: await loadImageElement(normalizedSrc, true) }));
    candidates.push(async () => ({ image: await loadImageElement(normalizedSrc, false) }));
  }

  for (const getCandidate of candidates) {
    let samplingImage: SamplingImage | null = null;
    try {
      samplingImage = await getCandidate();
      return samplePixels(samplingImage.image, width, height);
    } catch {
      // Continue through remaining candidates.
    } finally {
      samplingImage?.cleanup?.();
    }
  }

  throw new Error("Unable to sample particle colors");
};

const buildPointCloud = async (
  imageElement: HTMLImageElement | null,
  src: string,
  width: number,
  height: number,
): Promise<{
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  basePositions: Float32Array;
  explodeVectors: Float32Array;
}> => {
  const pixels = await resolveSamplePixels(imageElement, src, width, height);
  const pointCount = SAMPLE_COLS * SAMPLE_ROWS;
  const positions = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const basePositions = new Float32Array(pointCount * 3);
  const explodeVectors = new Float32Array(pointCount * 3);

  let index = 0;
  for (let y = 0; y < SAMPLE_ROWS; y += 1) {
    for (let x = 0; x < SAMPLE_COLS; x += 1) {
      const pixelIndex = (y * SAMPLE_COLS + x) * 4;
      const colorIndex = index * 3;
      const px = ((x + 0.5) / SAMPLE_COLS - 0.5) * width;
      const py = (0.5 - (y + 0.5) / SAMPLE_ROWS) * height;

      positions[colorIndex] = px;
      positions[colorIndex + 1] = py;
      positions[colorIndex + 2] = 0;

      basePositions[colorIndex] = px;
      basePositions[colorIndex + 1] = py;
      basePositions[colorIndex + 2] = 0;

      const distance = Math.sqrt(px * px + py * py);
      const spread = 9 + (distance / Math.max(width, height)) * 30 + Math.random() * 12;
      const angle = Math.atan2(py, px) + (Math.random() - 0.5) * 0.7;
      explodeVectors[colorIndex] = Math.cos(angle) * spread;
      explodeVectors[colorIndex + 1] = Math.sin(angle) * spread;
      explodeVectors[colorIndex + 2] = (Math.random() - 0.5) * 34;

      colors[colorIndex] = pixels[pixelIndex] / 255;
      colors[colorIndex + 1] = pixels[pixelIndex + 1] / 255;
      colors[colorIndex + 2] = pixels[pixelIndex + 2] / 255;
      index += 1;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: Math.max(1.6, width / 88),
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    toneMapped: false,
  });

  return { geometry, material, basePositions, explodeVectors };
};

export default function PointCloudHover({ hoverState }: PointCloudHoverProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const pointsRef = useRef<
    THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | null
  >(null);
  const basePositionsRef = useRef<Float32Array | null>(null);
  const explodeVectorsRef = useRef<Float32Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentStrengthRef = useRef(0);
  const targetStrengthRef = useRef(0);
  const requestTokenRef = useRef(0);
  const [isCloudReady, setIsCloudReady] = useState(false);

  const clearPoints = () => {
    if (pointsRef.current && sceneRef.current) {
      sceneRef.current.remove(pointsRef.current);
      pointsRef.current.geometry.dispose();
      pointsRef.current.material.dispose();
      pointsRef.current = null;
    }
    basePositionsRef.current = null;
    explodeVectorsRef.current = null;
    currentStrengthRef.current = 0;
    targetStrengthRef.current = 0;
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
    camera.position.z = 180;

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    const renderLoop = () => {
      const points = pointsRef.current;
      const sceneInstance = sceneRef.current;
      const cameraInstance = cameraRef.current;
      const rendererInstance = rendererRef.current;
      const basePositions = basePositionsRef.current;
      const explodeVectors = explodeVectorsRef.current;
      if (
        points &&
        sceneInstance &&
        cameraInstance &&
        rendererInstance &&
        basePositions &&
        explodeVectors
      ) {
        const positions = points.geometry.attributes.position.array as Float32Array;
        currentStrengthRef.current +=
          (targetStrengthRef.current - currentStrengthRef.current) * 0.14;
        const strength = currentStrengthRef.current;
        const time = performance.now() * 0.0019;

        for (let index = 0; index < positions.length; index += 3) {
          const noisePhase = index * 0.015;
          positions[index] =
            basePositions[index] +
            explodeVectors[index] * strength +
            Math.sin(time + noisePhase) * 0.75 * strength;
          positions[index + 1] =
            basePositions[index + 1] +
            explodeVectors[index + 1] * strength +
            Math.cos(time * 1.1 + noisePhase) * 0.75 * strength;
          positions[index + 2] =
            basePositions[index + 2] +
            explodeVectors[index + 2] * strength +
            Math.sin(time * 1.4 + noisePhase) * 1.15 * strength;
        }

        points.geometry.attributes.position.needsUpdate = true;
        points.rotation.z = 0.02 * strength;
        points.material.opacity = 0.75 + strength * 0.3;
        rendererInstance.render(sceneInstance, cameraInstance);
      } else if (rendererInstance && sceneInstance && cameraInstance) {
        rendererInstance.clear();
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearPoints();
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      pointsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!hoverState || !renderer || !camera) {
      targetStrengthRef.current = 0;
      setIsCloudReady(false);
      return;
    }

    const { width, height } = hoverState.rect;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    targetStrengthRef.current = 1;
  }, [hoverState ? 1 : 0, hoverState?.rect.width, hoverState?.rect.height]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    const token = requestTokenRef.current + 1;
    requestTokenRef.current = token;
    clearPoints();
    setIsCloudReady(false);
    if (!hoverState) {
      return;
    }

    const { src, rect, imageElement } = hoverState;

    buildPointCloud(imageElement, src, rect.width, rect.height)
      .then(({ geometry, material, basePositions, explodeVectors }) => {
        if (requestTokenRef.current !== token || !sceneRef.current) {
          geometry.dispose();
          material.dispose();
          return;
        }

        if (pointsRef.current) {
          sceneRef.current.remove(pointsRef.current);
          pointsRef.current.geometry.dispose();
          pointsRef.current.material.dispose();
        }

        const points = new THREE.Points(geometry, material);
        sceneRef.current.add(points);
        pointsRef.current = points;
        basePositionsRef.current = basePositions;
        explodeVectorsRef.current = explodeVectors;
        currentStrengthRef.current = 0;
        targetStrengthRef.current = 1;
        setIsCloudReady(true);
      })
      .catch(() => {
        if (requestTokenRef.current === token) {
          targetStrengthRef.current = 0;
          setIsCloudReady(false);
        }
      });
  }, [
    hoverState?.src,
    hoverState?.imageElement,
    hoverState?.rect.width,
    hoverState?.rect.height,
  ]);

  return (
    <div
      className="point-cloud-hover pointer-events-none fixed z-[70] overflow-hidden"
      style={{
        left: hoverState?.rect.left ?? 0,
        top: hoverState?.rect.top ?? 0,
        width: hoverState?.rect.width ?? 0,
        height: hoverState?.rect.height ?? 0,
        opacity: hoverState && isCloudReady ? 1 : 0,
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
