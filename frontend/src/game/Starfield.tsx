import React, { useEffect, useRef } from 'react';

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Respect prefers-reduced-motion media query
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate stars with multi-layer depth (distant dust + foreground stellar nodes)
    const starCount = prefersReducedMotion ? 80 : 160;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      speedX: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.08,
      speedY: prefersReducedMotion ? 0 : -(Math.random() * 0.25 + 0.08),
      twinkleSpeed: prefersReducedMotion ? 0 : Math.random() * 0.015 + 0.005,
      hue: Math.random() > 0.8 ? '#00f0ff' : Math.random() > 0.6 ? '#f59e0b' : '#ffffff',
    }));

    // Distant subtle nebula dust clusters
    const dustClusters = [
      { x: width * 0.2, y: height * 0.35, r: 180, color: 'rgba(245, 158, 11, 0.04)' },
      { x: width * 0.7, y: height * 0.5, r: 240, color: 'rgba(0, 240, 255, 0.04)' },
      { x: width * 0.85, y: height * 0.2, r: 160, color: 'rgba(168, 85, 247, 0.04)' },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient backdrop
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        60,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      grad.addColorStop(0, '#0a0f1d');
      grad.addColorStop(0.55, '#070a14');
      grad.addColorStop(1, '#03050a');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render static distant nebula dust
      dustClusters.forEach((d) => {
        const dGrad = ctx.createRadialGradient(d.x, d.y, 10, d.x, d.y, d.r);
        dGrad.addColorStop(0, d.color);
        dGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render & drift stars
      stars.forEach((star) => {
        if (!prefersReducedMotion) {
          star.x += star.speedX;
          star.y += star.speedY;

          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;

          star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.008;
        }

        const clampedAlpha = Math.max(0.12, Math.min(0.9, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.hue === '#ffffff'
          ? `rgba(226, 232, 240, ${clampedAlpha})`
          : star.hue === '#00f0ff'
          ? `rgba(0, 240, 255, ${clampedAlpha})`
          : `rgba(245, 158, 11, ${clampedAlpha})`;

        if (star.radius > 1.2 && !prefersReducedMotion) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = star.hue;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
    />
  );
};
