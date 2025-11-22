import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const toCssLength = (value) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

const cx = (...parts) => parts.filter(Boolean).join(" ");

const useResizeObserver = (callback, elements, deps) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      window.addEventListener("resize", callback);
      callback();
      return () => window.removeEventListener("resize", callback);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const obs = new ResizeObserver(callback);
      obs.observe(ref.current);
      return obs;
    });

    callback();
    return () => observers.forEach((o) => o?.disconnect());
  }, deps);
};

const useImageLoader = (seqRef, onLoad, deps) => {
  useEffect(() => {
    const imgs = seqRef.current?.querySelectorAll("img") ?? [];
    if (imgs.length === 0) return onLoad();

    let remaining = imgs.length;
    const done = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };
    imgs.forEach((img) => {
      if (img.complete) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
    return () =>
      imgs.forEach((img) => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
      });
  }, deps);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover) => {
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = (t) => {
      if (lastRef.current == null) lastRef.current = t;
      const dt = Math.max(0, t - lastRef.current) / 1000;
      lastRef.current = t;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;
      const k = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * k;

      if (seqWidth > 0) {
        let next = offsetRef.current + velocityRef.current * dt;
        next = ((next % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = next;
        track.style.transform = `translate3d(${-next}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover, trackRef]);
};

const ImageLoop = memo(
  ({
    images,
    speed = 120,
    direction = "left",
    height = 240,
    gap = 12,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor = "#ffffff",
    scaleOnHover = false,
    className,
    style,
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);
    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(2);
    const [isHovered, setIsHovered] = useState(false);

    const velocity = useMemo(() => {
      const dir = direction === "left" ? 1 : -1;
      return Math.abs(speed) * dir;
    }, [speed, direction]);

    const updateSize = useCallback(() => {
      const cw = containerRef.current?.clientWidth ?? 0;
      const sw = seqRef.current?.getBoundingClientRect?.().width ?? 0;
      if (sw > 0) {
        setSeqWidth(Math.ceil(sw));
        const copies = Math.ceil(cw / sw) + 2;
        setCopyCount(Math.max(2, copies));
      }
    }, []);

    useResizeObserver(updateSize, [containerRef, seqRef], [images, gap, height]);
    useImageLoader(seqRef, updateSize, [images, gap, height]);
    useAnimationLoop(trackRef, velocity, seqWidth, isHovered, pauseOnHover);

    const vars = useMemo(
      () => ({
        "--imgloop-gap": `${gap}px`,
        "--imgloop-height": `${height}px`,
        "--imgloop-fadeColor": fadeOutColor,
      }),
      [gap, height, fadeOutColor]
    );

    const containerStyle = { ...vars, width: "100%", ...style };

    return (
      <div
        ref={containerRef}
        className={cx("relative overflow-hidden group", className)}
        style={containerStyle}
        onMouseEnter={() => pauseOnHover && setIsHovered(true)}
        onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      >
        {fadeOut && (
          <>
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-[clamp(24px,8%,120px)] pointer-events-none z-10 bg-[linear-gradient(to_right,var(--imgloop-fadeColor)_0%,rgba(0,0,0,0)_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 w-[clamp(24px,8%,120px)] pointer-events-none z-10 bg-[linear-gradient(to_left,var(--imgloop-fadeColor)_0%,rgba(0,0,0,0)_100%)]"
            />
          </>
        )}

        <div ref={trackRef} className="flex w-max will-change-transform select-none">
          {Array.from({ length: copyCount }).map((_, copyIndex) => (
            <ul
              key={copyIndex}
              className="flex items-center"
              ref={copyIndex === 0 ? seqRef : undefined}
              aria-hidden={copyIndex > 0}
            >
              {images.map((src, i) => (
                <li key={`${copyIndex}-${i}`} className="flex-none mr-[var(--imgloop-gap)]">
                  <img
                    src={src}
                    alt=""
                    className={cx(
                      "block object-cover rounded-md h-[var(--imgloop-height)] w-auto pointer-events-none select-none",
                      scaleOnHover &&
                        "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-110"
                    )}
                    draggable={false}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    );
  }
);

ImageLoop.displayName = "ImageLoop";
export default ImageLoop;
