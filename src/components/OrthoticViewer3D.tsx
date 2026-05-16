import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, RotateCcw, Activity, ShieldCheck } from 'lucide-react';

export const OrthoticViewer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'mesh' | 'support' | 'pressure'>('mesh');
  const [materialPreset, setMaterialPreset] = useState<'eva' | 'gel' | 'progrip'>('eva');
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    
    // Podium (Grounding)
    const podiumGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.4, 64);
    const podiumMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.05, 
      metalness: 0.05,
      transparent: true,
      opacity: 0.6
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -2.2;
    podium.receiveShadow = true;
    scene.add(podium);

    // Soft Contact Shadow Simulation (Radial Gradient)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const context = shadowCanvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const softShadowGeo = new THREE.PlaneGeometry(6, 6);
    const softShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const softShadow = new THREE.Mesh(softShadowGeo, softShadowMat);
    softShadow.rotation.x = -Math.PI / 2;
    softShadow.position.y = -1.98; // Slightly above ground
    scene.add(softShadow);

    // Wide Ambient Occlusion Plane
    const aoShadowGeo = new THREE.PlaneGeometry(10, 10);
    const aoShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const aoShadow = new THREE.Mesh(aoShadowGeo, aoShadowMat);
    aoShadow.rotation.x = -Math.PI / 2;
    aoShadow.position.y = -2.0;
    scene.add(aoShadow);

    // Shadow Plane (Floor)
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
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
        specularIntensity: 0.5
      },
      gel: {
        color: 0x0062FF,
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.7, // High polymer translucency
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        thickness: 4.0,
        ior: 1.33,
        sheen: 1.0,
        attenuationColor: new THREE.Color(0x00E5FF),
        attenuationDistance: 0.4,
        specularIntensity: 1.0
      },
      progrip: {
        color: 0x0F172A,
        roughness: 0.9, // High grip texture
        metalness: 0.0,
        transmission: 0.0,
        clearcoat: 0.1,
        thickness: 1.0,
        ior: 1.6,
        sheen: 1.0,
        sheenColor: new THREE.Color(0x0062FF),
        sheenRoughness: 1.0,
        specularIntensity: 0.2
      }
    };

    const currentPreset = presets[materialPreset];

    const material = new THREE.MeshPhysicalMaterial({
      ...currentPreset,
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

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      const bob = Math.sin(time) * 0.1;
      insoleGroup.position.y = bob;

      // Dynamic Contact Shadow (Darker when closer)
      softShadow.scale.setScalar(1 + bob * 0.2);
      aoShadow.scale.setScalar(1 + bob * 0.1);
      softShadowMat.opacity = 0.35 - bob * 0.15;
      aoShadowMat.opacity = 0.1 - bob * 0.05;

      controls.update();

      // Podium subtle pulse
      if (podium.material instanceof THREE.MeshStandardMaterial) {
        podium.material.opacity = 0.4 + bob * 1.5;
      }

      heatmapPoints.forEach((p, i) => {
          p.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.3);
          if (p.material instanceof THREE.MeshBasicMaterial) {
            p.material.opacity = 0.4 + Math.sin(time * 2 + i) * 0.4;
          }
      });

      // Interactive focus
      if (activeLayer === 'pressure') {
        material.color.setHex(0x0f172a);
        material.emissive.setHex(0xFF3D00);
        material.emissiveIntensity = 0.2;
        if (wireframe.material instanceof THREE.MeshBasicMaterial) {
          wireframe.material.opacity = 0.4;
          wireframe.material.color.setHex(0xFF3D00);
        }
      } else if (activeLayer === 'support') {
        material.color.setHex(0x1e293b);
        material.emissive.setHex(0x00E5FF);
        material.emissiveIntensity = 0.1;
        if (wireframe.material instanceof THREE.MeshBasicMaterial) {
          wireframe.material.opacity = 0.3;
          wireframe.material.color.setHex(0x00E5FF);
        }
      } else {
        material.color.setHex(0x1e293b);
        material.emissive.setHex(0x000000);
        material.emissiveIntensity = 0;
        if (wireframe.material instanceof THREE.MeshBasicMaterial) {
          wireframe.material.opacity = 0.1;
          wireframe.material.color.setHex(0x0062FF);
        }
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

    return () => {
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
  }, [activeLayer, materialPreset, isFullscreen]);

  return (
    <div className={`relative group transition-all duration-500 overflow-hidden ${
      isFullscreen 
        ? 'fixed inset-0 z-[100] bg-white w-screen h-screen' 
        : 'w-full h-full bg-white rounded-[40px] border border-slate-200 shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,98,255,0.05),transparent_70%)]" />
      
      {/* UI Overlay */}
      <div className={`absolute z-20 space-y-4 ${isFullscreen ? 'top-12 left-12' : 'top-8 left-8'}`}>
        <div className="flex flex-col gap-1 bg-white/40 backdrop-blur-sm p-3 rounded-2xl border border-white/50 shadow-sm">
          <h4 className="text-clinic-navy font-display font-black text-xs uppercase tracking-[0.2em]">Live Biometric Stream</h4>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-clinic-blue rounded-full animate-ping" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Orthotic Engine v4.2</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { id: 'mesh', label: 'Structural Mesh', icon: <Maximize2 className="w-3 h-3" /> },
            { id: 'support', label: 'Support Zones', icon: <ShieldCheck className="w-3 h-3" /> },
            { id: 'pressure', label: 'Pressure Map', icon: <Activity className="w-3 h-3" /> }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveLayer(btn.id as any)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md ${
                activeLayer === btn.id 
                ? 'bg-clinic-navy text-white shadow-clinic-blue/20 translate-x-1' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Material Presets */}
        <div className="pt-4 space-y-3">
          <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Manufacturing Presets</h5>
          <div className="flex gap-2">
            {[
              { id: 'eva', label: 'EVA', color: 'bg-slate-800' },
              { id: 'gel', label: 'GEL', color: 'bg-clinic-blue' },
              { id: 'progrip', label: 'PRO', color: 'bg-slate-950' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMaterialPreset(m.id as any)}
                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-[8px] font-black ${
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
      </div>

      <div className={`absolute z-20 flex items-center gap-4 ${isFullscreen ? 'bottom-12 right-12' : 'bottom-8 right-8'}`}>
         <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xl">
            <div className="flex gap-1">
               <span className="w-1 h-3 bg-clinic-blue/20 rounded-full" />
               <span className="w-1 h-3 bg-clinic-blue/40 rounded-full" />
               <span className="w-1 h-3 bg-clinic-blue/60 rounded-full" />
            </div>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.1em]">
               {isFullscreen ? 'Immersive Clinical View Active • Esc to Exit' : 'Scroll to Zoom • Right Click to Pan • Drag to Rotate'}
            </span>
         </div>
         <button 
           onClick={() => setIsFullscreen(!isFullscreen)}
           className={`p-3 rounded-full border transition-all shadow-xl ${
             isFullscreen 
               ? 'bg-clinic-navy text-white border-clinic-navy hover:scale-110' 
               : 'bg-white/90 backdrop-blur-md border-slate-200 hover:bg-clinic-blue hover:text-white'
           }`}
           title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
         >
            <Maximize2 className={`w-4 h-4 transform ${isFullscreen ? 'rotate-180 scale-90' : ''}`} />
         </button>
         <button className="reset-btn bg-white/90 backdrop-blur-md p-3 rounded-full border border-slate-200 hover:bg-clinic-blue hover:text-white transition-colors shadow-xl">
            <RotateCcw className="w-4 h-4" />
         </button>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Dynamic Data Overlay */}
      <div className={`absolute z-20 pointer-events-none ${isFullscreen ? 'bottom-12 left-12' : 'bottom-8 left-8'}`}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeLayer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-100 shadow-xl space-y-2 min-w-[200px]"
          >
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Zone Analysis</span>
              <span className="text-[10px] font-black text-clinic-blue">94% MATCH</span>
            </div>
            <div className="text-clinic-navy font-display font-black text-lg uppercase tracking-tight leading-none italic drop-shadow-sm">
                {activeLayer === 'mesh' ? 'Precise 4D Geometry' : activeLayer === 'support' ? 'Medial Arch Guard' : 'Metatarsal Relief'}
            </div>
            <p className="text-[8px] text-slate-500 font-bold uppercase leading-relaxed">
                {activeLayer === 'mesh' ? 'Spain-engineered VOXELCARE scan data mapped to 0.1mm tolerance.' : activeLayer === 'support' ? 'Dynamic structural reinforcement for flat feet correction.' : 'Isolating high-impact pressure points for systemic relief.'}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
