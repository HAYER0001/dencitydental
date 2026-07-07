"use client";

import { Suspense, useRef, useEffect } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function ToothModel({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const modelRef = useRef<any>(null);
  const { scene } = useGLTF("/tooth.glb");

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#ffffff"),
          metalness: 0.1,
          roughness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });
      }
    });
  }, [scene]);

  useGSAP(() => {
    if (!modelRef.current || !containerRef.current) return;
    
    gsap.to(modelRef.current.rotation, {
      y: Math.PI * 6,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  }, { scope: containerRef });

  return (
    <Center ref={modelRef} scale={18}>
      <primitive object={scene} />
    </Center>
  );
}

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(text1Ref.current, { autoAlpha: 1 });
    gsap.set([text2Ref.current, text3Ref.current], { autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(text1Ref.current, { autoAlpha: 0, scale: 0.9, duration: 1 })
      .fromTo(text2Ref.current, { scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 1 })
      .to(text2Ref.current, { autoAlpha: 0, scale: 0.9, duration: 1 })
      .fromTo(text3Ref.current, { scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 1 });
      
  }, { scope: containerRef });

  return (
    <div id="hero-3d-wrapper" ref={containerRef} className="relative h-[400vh] w-full bg-[#0F1717]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        <div className="absolute inset-0 z-0">
          <Image src="/gallery/living-room.JPG" alt="Background" fill style={{ objectFit: "cover", opacity: 0.2 }} priority />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          <div ref={text1Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white uppercase font-black tracking-tighter leading-[0.85] text-[10vw] md:text-[12vw] mix-blend-difference">
            <div>OFFICE FOR<br/>FUTURE<br/>DENTISTRY</div>
          </div>
          <div ref={text2Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white uppercase font-black tracking-tighter leading-[0.85] text-[10vw] md:text-[12vw] mix-blend-difference">
            <div>AESTHETIC<br/>REHABILITATION</div>
          </div>
          <div ref={text3Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white uppercase font-black tracking-tighter leading-[0.85] text-[10vw] md:text-[12vw] mix-blend-difference">
            <div>YOUR PERFECT<br/>SMILE</div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <Canvas className="h-screen w-full" camera={{ position: [0, 0, 20], fov: 45 }}>
            <ambientLight intensity={2} />
            <directionalLight position={[0, 0, 10]} intensity={6} color="#ffffff" />
            <Suspense fallback={null}>
              <ToothModel containerRef={containerRef} />
              <Environment preset="city" />
              <ContactShadows position={[0, -8, 0]} opacity={0.8} scale={30} blur={3} far={15} color="#000000" />
            </Suspense>
          </Canvas>
        </div>

      </div>
    </div>
  );
}

useGLTF.preload("/tooth.glb");