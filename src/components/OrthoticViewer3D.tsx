import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, RotateCcw, Activity, ShieldCheck, Volume2, Loader2, Wand2 } from 'lucide-react';

export const OrthoticViewer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'mesh' | 'support' | 'pressure'>('mesh');
  const [materialPreset, setMaterialPreset] = useState<'eva' | 'gel' | 'progrip'>('eva');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [painDescription, setPainDescription] = useState('');
  const [selectedFootwear, setSelectedFootwear] = useState<'athletic' | 'dress' | 'boots' | 'casual'>('athletic');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    'Describe your exact pain (e.g., sharp heel pain when waking up)',
    'Ilarawan ang iyong sakit (halimbawa: matalim na sakit sa sakong pagkagising)',
    'Ihulagway ang imong kasakit (pananglitan: hait nga sakit sa tikod inigmata)'
  ];

  const FOOTWEAR_OPTIONS = [
    { id: 'athletic', label: 'Athletic', emoji: '👟' },
    { id: 'dress', label: 'Dress', emoji: '👞' },
    { id: 'boots', label: 'Boots', emoji: '🥾' },
    { id: 'casual', label: 'Casual', emoji: '👟' }
  ];

  const [isMobile, setIsMobile] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleAiAnalysis = async () => {
    if (!painDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/orthotic-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: painDescription })
      });
      const data = await response.json();
      if (data.suggestions) {
        setAiAnalysis(data.suggestions);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const presets = {
    eva: {
      color: 0x1E293B,
      roughness: 0.55,
      metalness: 0.2,
      transmission: 0.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      thickness: 0,
      ior: 1.45,
      sheen: 0.8,
      sheenRoughness: 0.5,
      specularIntensity: 0.5,
      emissive: 0x000000,
      emissiveIntensity: 0,
      attenuationColor: 0x1E293B,
      attenuationDistance: 1.0
    },
    gel: {
      color: 0x0062FF,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      thickness: 4.0,
      ior: 1.33,
      sheen: 1.0,
      sheenRoughness: 0.2,
      specularIntensity: 1.0,
      emissive: 0x000000,
      emissiveIntensity: 0,
      attenuationColor: 0x00E5FF,
      attenuationDistance: 0.4
    },
    progrip: {
      color: 0x0F172A,
      roughness: 0.9,
      metalness: 0.0,
      transmission: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.8,
      thickness: 1.0,
      ior: 1.6,
      sheen: 1.0,
      sheenRoughness: 1.0,
      specularIntensity: 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0,
      attenuationColor: 0x0F172A,
      attenuationDistance: 1.0
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 4, 8);

    // Advanced Environment Mapping (Procedural HDRI)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const createEnvMap = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Subtle background gradient
        const grd = ctx.createLinearGradient(0, 0, 0, 256);
        grd.addColorStop(0, '#f8fafc');
        grd.addColorStop(0.5, '#e2e8f0');
        grd.addColorStop(1, '#f8fafc');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 512, 256);
        
        // Large Softbox
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(50, 20, 150, 200);
        
        // Rim Light Softbox
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(380, 50, 40, 150);

        // Ceiling Light
        const radGrd = ctx.createRadialGradient(256, 40, 0, 256, 40, 100);
        radGrd.addColorStop(0, 'rgba(255, 255, 255, 1)');
        radGrd.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radGrd;
        ctx.fillRect(0, 0, 512, 100);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      return tex;
    };
    
    scene.environment = pmremGenerator.fromEquirectangular(createEnvMap()).texture;
    scene.background = null;

    // Lights - Studio Quality Photographic Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00E5FF, 0.8);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    const bounceLight = new THREE.PointLight(0xffffff, 0.3, 10);
    bounceLight.position.set(0, -2, 0);
    scene.add(bounceLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08; // Slightly smoother
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.screenSpacePanning = true; 
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 1.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    
    // Stop auto-rotation on user interaction
    const startInteraction = () => {
      controls.autoRotate = false;
    };
    renderer.domElement.addEventListener('pointerdown', startInteraction);
    renderer.domElement.addEventListener('wheel', startInteraction);
    
    // Podium (Grounding) - Multi-layered technical base
    const podiumGroup = new THREE.Group();
    
    // Main Glass Base
    const podiumGeo = new THREE.CylinderGeometry(5.2, 5.5, 0.4, 64);
    const podiumMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.0,
      transmission: 0.9,
      thickness: 1.0,
      transparent: true,
      opacity: 0.5,
      ior: 1.5
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.receiveShadow = true;
    podiumGroup.add(podium);

    // Accent Rim (Neon Cyan)
    const rimGeo = new THREE.TorusGeometry(5.35, 0.02, 16, 100);
    const rimMat = new THREE.MeshBasicMaterial({ 
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.8
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.19; // Top edge
    podiumGroup.add(rim);

    // Internal Core Glow
    const coreGeo = new THREE.CylinderGeometry(4.8, 4.8, 0.1, 64);
    const coreMat = new THREE.MeshBasicMaterial({ 
      color: 0x0062FF,
      transparent: true,
      opacity: 0.05
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = -0.15;
    podiumGroup.add(core);

    podiumGroup.position.y = -2.4;
    scene.add(podiumGroup);

    // Soft Contact Shadow Simulation (Radial Gradient)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const context = shadowCanvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    
    // 1. Insole Contact Shadow (Cast onto Podium)
    const softShadowGeo = new THREE.PlaneGeometry(6, 6);
    const softShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.MultiplyBlending
    });
    const softShadow = new THREE.Mesh(softShadowGeo, softShadowMat);
    softShadow.rotation.x = -Math.PI / 2;
    softShadow.position.y = -2.18; // Just above podium top
    scene.add(softShadow);

    // 2. Podium Shadow (Large soft shadow beneath podium on ground)
    const podiumShadowGeo = new THREE.PlaneGeometry(16, 16);
    const podiumShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.MultiplyBlending
    });
    const podiumShadow = new THREE.Mesh(podiumShadowGeo, podiumShadowMat);
    podiumShadow.rotation.x = -Math.PI / 2;
    podiumShadow.position.y = -2.61; // Just above floor the podium sits on
    scene.add(podiumShadow);

    // 3. Ambient Occlusion (Tighter floor shadow)
    const aoShadowGeo = new THREE.PlaneGeometry(10, 10);
    const aoShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
    const aoShadow = new THREE.Mesh(aoShadowGeo, aoShadowMat);
    aoShadow.rotation.x = -Math.PI / 2;
    aoShadow.position.y = -2.62;
    scene.add(aoShadow);

    // Shadow Plane (Floor)
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.63; // Everything rests here
    floor.receiveShadow = true;
    scene.add(floor);

    // Create Insole Geometry (Parametric Shape)
    const insoleGroup = new THREE.Group();
    
    // Base Shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(1, 2, 1.5, 4, 1, 6); // Inner arch
    shape.bezierCurveTo(0.5, 7.5, -0.5, 8, -1.5, 7.5); // Toe
    shape.bezierCurveTo(-2.5, 6, -2, 2, -1.5, 0); // Outer edge
    shape.bezierCurveTo(-1, -1, -0.5, -1, 0, 0); // Heel

    const extrudeSettings = {
      steps: 2,
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelOffset: 0,
      bevelSegments: 5
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateX(-Math.PI / 2.5);

    const initialPreset = presets[materialPreset];

    const material = new THREE.MeshPhysicalMaterial({
      ...initialPreset,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    insoleGroup.add(mesh);

    // Holographic Grid Overlay
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x0062FF,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const wireframe = new THREE.Mesh(geometry, wireMaterial);
    wireframe.scale.setScalar(1.02);
    insoleGroup.add(wireframe);

    // Add Heatmap Points (Support Zones)
    const pointsGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const heatmapPoints: THREE.Mesh[] = [];
    const positions = [
        [0.2, 0.5, 1], [-0.8, 0.5, 1.5], [0, 0.5, -2], [-1.2, 0.5, -0.5]
    ];

    positions.forEach((pos, i) => {
        const pMat = new THREE.MeshBasicMaterial({
            color: i === 2 ? 0xFF3D00 : 0x00E5FF,
            transparent: true,
            opacity: 0.8
        });
        const p = new THREE.Mesh(pointsGeo, pMat);
        p.position.set(pos[0], pos[1], pos[2]);
        insoleGroup.add(p);
        heatmapPoints.push(p);
    });

    scene.add(insoleGroup);

    // Refs for state that's accessed in animation loop to avoid effect re-runs
    const stateRef = {
      activeLayer,
      materialPreset,
      lerpSpeed: 0.08
    };

    // Animation Loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      const bob = Math.sin(time) * 0.1;
      insoleGroup.position.y = bob;

      // Dynamic Contact Shadow (Darker when closer)
      softShadow.scale.setScalar(1 + bob * 0.2);
      aoShadow.scale.setScalar(1 + bob * 0.1);
      softShadowMat.opacity = 0.35 - bob * 0.15;
      aoShadowMat.opacity = 0.1 - bob * 0.05;

      controls.update();

      // Podium pulse & Rim rotation
      if (podium.material instanceof THREE.MeshPhysicalMaterial) {
        podium.material.opacity = 0.5 + bob * 0.5;
      }
      rim.rotation.z += 0.005;
      rimMat.opacity = 0.6 + Math.sin(time * 2) * 0.2;

      heatmapPoints.forEach((p, i) => {
          p.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.3);
          if (p.material instanceof THREE.MeshBasicMaterial) {
            p.material.opacity = 0.4 + Math.sin(time * 2 + i) * 0.4;
          }
      });

      // Smooth Material Transition Logic
      const targetPreset = (presets as any)[stateRef.materialPreset];
      const speed = stateRef.lerpSpeed;

      // Color transition
      material.color.lerp(new THREE.Color(targetPreset.color), speed);
      
      // Numeric property transitions
      material.roughness = THREE.MathUtils.lerp(material.roughness, targetPreset.roughness, speed);
      material.metalness = THREE.MathUtils.lerp(material.metalness, targetPreset.metalness, speed);
      material.transmission = THREE.MathUtils.lerp(material.transmission, targetPreset.transmission, speed);
      material.clearcoat = THREE.MathUtils.lerp(material.clearcoat, targetPreset.clearcoat, speed);
      material.clearcoatRoughness = THREE.MathUtils.lerp(material.clearcoatRoughness, targetPreset.clearcoatRoughness, speed);
      material.thickness = THREE.MathUtils.lerp(material.thickness, targetPreset.thickness, speed);
      material.ior = THREE.MathUtils.lerp(material.ior, targetPreset.ior, speed);
      material.sheen = THREE.MathUtils.lerp(material.sheen, targetPreset.sheen, speed);
      material.sheenRoughness = THREE.MathUtils.lerp(material.sheenRoughness, targetPreset.sheenRoughness, speed);
      material.specularIntensity = THREE.MathUtils.lerp(material.specularIntensity, targetPreset.specularIntensity, speed);
      material.attenuationDistance = THREE.MathUtils.lerp(material.attenuationDistance, targetPreset.attenuationDistance, speed);
      material.attenuationColor.lerp(new THREE.Color(targetPreset.attenuationColor), speed);

      // Layer-based emissive transitions
      let targetEmissive = 0x000000;
      let targetEmissiveIntensity = 0;
      let targetWireOpacity = 0.1;
      let targetWireColor = 0x0062FF;

      if (stateRef.activeLayer === 'pressure') {
        targetEmissive = 0xFF3D00;
        targetEmissiveIntensity = 0.3;
        targetWireOpacity = 0.4;
        targetWireColor = 0xFF3D00;
      } else if (stateRef.activeLayer === 'support') {
        targetEmissive = 0x00E5FF;
        targetEmissiveIntensity = 0.2;
        targetWireOpacity = 0.3;
        targetWireColor = 0x00E5FF;
      }

      material.emissive.lerp(new THREE.Color(targetEmissive), speed);
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetEmissiveIntensity, speed);
      
      if (wireframe.material instanceof THREE.MeshBasicMaterial) {
        wireframe.material.opacity = THREE.MathUtils.lerp(wireframe.material.opacity, targetWireOpacity, speed);
        wireframe.material.color.lerp(new THREE.Color(targetWireColor), speed);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    // Initial resize if entering fullscreen
    if (isFullscreen) {
      setTimeout(handleResize, 100);
    }

    const handleReset = () => {
      camera.position.set(4, 4, 8);
      controls.target.set(0, 0, 0);
      controls.update();
    };

    const resetButton = mountRef.current?.parentElement?.querySelector('.reset-btn');
    resetButton?.addEventListener('click', handleReset);

    // Handle state updates via ref to keep animation loop current without re-running useEffect
    const updateState = () => {
      stateRef.activeLayer = activeLayer;
      stateRef.materialPreset = materialPreset;
    };
    updateState();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      resetButton?.removeEventListener('click', handleReset);
      renderer.domElement.removeEventListener('pointerdown', startInteraction);
      renderer.domElement.removeEventListener('wheel', startInteraction);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      controls.dispose();
    };
  }, [isFullscreen, activeLayer, materialPreset]); // Keeping activeLayer and materialPreset for ref-like updates if we want to ensure sync, but the logic is now in ref.


  return (
    <div className={`relative group transition-all duration-500 overflow-hidden ${
      isFullscreen 
        ? 'fixed inset-0 z-[100] bg-white w-screen h-screen' 
        : 'w-full h-full bg-white rounded-[40px] border border-slate-200 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,98,255,0.05),transparent_70%)]" />
      
      {/* UI Overlay - Responsive Layout */}
      <div className={`absolute z-20 pointer-events-none inset-0 p-4 md:p-8 flex flex-col md:flex-row justify-between ${isFullscreen ? 'p-10' : ''}`}>
        {/* Top Section / Left Side: Diagnostic Controls */}
        <div className="flex flex-col gap-3 w-full md:w-auto pointer-events-auto">
          <div className="flex items-center justify-between md:flex-col md:items-start gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg">
            <div className="space-y-1">
              <h4 className="text-clinic-navy font-display font-black text-[9px] uppercase tracking-[0.2em]">Diagnostic Stream</h4>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-clinic-blue rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">v4.2 Analysis</span>
              </div>
            </div>
            
            <div className="flex gap-1.5">
               <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-slate-100 text-clinic-navy md:hidden"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button className="reset-btn p-2 rounded-lg bg-slate-100 text-clinic-navy md:hidden">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {[
              { id: 'mesh', label: 'Mesh', icon: <Maximize2 className="w-3 h-3" /> },
              { id: 'support', label: 'Support', icon: <ShieldCheck className="w-3 h-3" /> },
              { id: 'pressure', label: 'Pressure', icon: <Activity className="w-3 h-3" /> }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveLayer(btn.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all shadow-sm whitespace-nowrap flex-1 md:flex-initial ${
                  activeLayer === btn.id 
                  ? 'bg-clinic-navy text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-slate-500 border border-white/50'
                }`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Desktop-only Secondary Controls */}
          <div className="hidden md:flex flex-col gap-4">
            {/* Manufacturing Presets */}
            <div className="space-y-2">
              <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Manufacturing</h5>
              <div className="flex gap-2">
                {[
                  { id: 'eva', label: 'EVA', color: 'bg-slate-800' },
                  { id: 'gel', label: 'GEL', color: 'bg-clinic-blue' },
                  { id: 'progrip', label: 'PRO', color: 'bg-slate-950' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMaterialPreset(m.id as any)}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center text-[8px] font-black ${
                      materialPreset === m.id 
                      ? 'border-clinic-blue scale-110 shadow-lg ring-4 ring-clinic-blue/10' 
                      : 'border-white bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${m.color} shadow-inner flex items-center justify-center text-white`}>
                      {m.label[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footwear */}
            <div className="space-y-2">
              <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Footwear Profile</h5>
              <div className="grid grid-cols-2 gap-2">
                {FOOTWEAR_OPTIONS.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFootwear(fw.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${
                      selectedFootwear === fw.id
                      ? 'bg-clinic-blue text-white border-clinic-blue shadow-md'
                      : 'bg-white/80 backdrop-blur-sm text-slate-500 border-white/50 hover:border-slate-200'
                    }`}
                  >
                    <span>{fw.emoji}</span>
                    {fw.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side / Middle Section: Analysis Card (Moved UP on mobile) */}
        <div className="flex flex-col justify-start md:justify-between items-end gap-4 pointer-events-none mt-4 md:mt-0">
          <div className="w-full md:w-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeLayer}-${selectedFootwear}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-clinic-navy/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-2xl space-y-3 w-full md:max-w-[240px] pointer-events-auto"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Meta</span>
                  <span className="text-[10px] font-black text-clinic-cyan">94% MATCH</span>
                </div>
                <div className="text-white font-display font-black text-sm md:text-lg uppercase tracking-tight leading-none italic">
                  {activeLayer === 'mesh' ? 'Precise 4D Geometry' : activeLayer === 'support' ? 'Medial Arch Guard' : 'Metatarsal Relief'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-clinic-blue/20 rounded text-[7px] font-black text-clinic-cyan uppercase">
                    {selectedFootwear} Profile
                  </span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[7px] font-black text-slate-400 uppercase">
                    {activeLayer} mode
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed">
                  {activeLayer === 'mesh' ? 'Voxelcare scan data mapped to 0.1mm tolerance.' : activeLayer === 'support' ? 'Correction for dynamic arch collapse.' : 'Pressure point isolation for shock absorption.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden md:flex flex-col gap-3 items-end pointer-events-auto">
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 flex items-center gap-3 shadow-lg">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.1em]">
                {isFullscreen ? 'Immersive Clinical View Active • Esc to Exit' : 'Orbit to Analyze • Scroll to Zoom'}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-3 rounded-full border transition-all shadow-xl ${
                  isFullscreen 
                    ? 'bg-clinic-navy text-white border-clinic-navy' 
                    : 'bg-white/90 backdrop-blur-md border-white/50 text-clinic-navy hover:bg-clinic-blue hover:text-white'
                }`}
              >
                <Maximize2 className={`w-4 h-4 transform ${isFullscreen ? 'rotate-180' : ''}`} />
              </button>
              <button className="reset-btn bg-white/90 backdrop-blur-md p-3 rounded-full border border-white/50 text-clinic-navy hover:bg-clinic-blue hover:text-white transition-all shadow-xl">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Input Overlay - Mobile Optimized */}
      <div className={`absolute z-30 bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 w-[92%] md:w-auto pointer-events-none`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-4 shadow-2xl pointer-events-auto md:w-64 space-y-3"
        >
          <div className="flex items-center justify-between">
            <label className="text-[8px] font-black text-clinic-blue uppercase tracking-widest block font-sans">
              Clinical Case Entry
            </label>
            <div className="flex gap-1">
               <span className={`w-1 h-1 rounded-full ${placeholderIndex === 0 ? 'bg-clinic-blue' : 'bg-slate-200'}`} />
               <span className={`w-1 h-1 rounded-full ${placeholderIndex === 1 ? 'bg-clinic-blue' : 'bg-slate-200'}`} />
               <span className={`w-1 h-1 rounded-full ${placeholderIndex === 2 ? 'bg-clinic-blue' : 'bg-slate-200'}`} />
            </div>
          </div>
          <div className="relative">
            <textarea
              value={painDescription}
              onChange={(e) => setPainDescription(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full h-14 md:h-20 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[10px] text-clinic-navy placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue/40 transition-all resize-none font-medium leading-relaxed"
            />
            <AnimatePresence>
              {aiAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-0 right-0 mb-4 bg-clinic-navy text-white p-4 rounded-2xl text-[9px] font-medium leading-relaxed border border-white/10 shadow-2xl z-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-clinic-cyan font-black uppercase tracking-widest">EZStep AI Verdict</span>
                  </div>
                  <div className="prose prose-invert prose-xs max-h-40 overflow-y-auto scrollbar-hide">
                    {aiAnalysis}
                  </div>
                  <button 
                    onClick={() => setAiAnalysis(null)}
                    className="mt-3 w-full py-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    Clear Result
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Multi-Lang Engine 2.0</span>
            <button 
              onClick={handleAiAnalysis}
              disabled={isAnalyzing || !painDescription.trim()}
              className="text-[7px] font-black text-clinic-blue uppercase tracking-widest hover:underline px-2 py-1 bg-clinic-blue/5 rounded disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing && <Loader2 className="w-2 h-2 animate-spin" />}
              Submit Analysis
            </button>
          </div>
        </motion.div>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

    </div>
  );
};
