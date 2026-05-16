import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pl1 = new THREE.PointLight(0x0062FF, 4, 80);
    pl1.position.set(8, 8, 10);
    scene.add(pl1);

    const pl2 = new THREE.PointLight(0x00E5FF, 2, 60);
    pl2.position.set(-10, -6, 8);
    scene.add(pl2);

    // Grid
    const grid = new THREE.GridHelper(80, 40, 0x0062FF, 0xE2E8F0);
    grid.position.y = -9;
    grid.material.opacity = 0.1;
    grid.material.transparent = true;
    scene.add(grid);

    // Floating Geometry
    const objs: THREE.Mesh[] = [];
    const colors = [0x0062FF, 0x00E5FF, 0x94A3B8, 0xCBD5E1, 0x0F172A];
    for (let i = 0; i < 7; i++) {
      const geo = new THREE.TorusGeometry(0.8 + Math.random() * 0.5, 0.2 + Math.random() * 0.15, 12, 48);
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        metalness: 0.6,
        roughness: 0.2,
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.15,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10 - 5
      );
      scene.add(m);
      objs.push(m);
    }

    // Particles
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 60;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x0062FF,
      transparent: true,
      opacity: 0.2
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const animate = () => {
      requestAnimationFrame(animate);
      const time = performance.now() * 0.0005;

      objs.forEach((o, idx) => {
        o.position.y += Math.sin(time + idx) * 0.005;
        o.rotation.x += 0.005;
        o.rotation.y += 0.007;
      });

      pl1.position.x = Math.sin(time * 0.4) * 10;
      pl1.position.y = Math.cos(time * 0.3) * 6;

      particlesMesh.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};
