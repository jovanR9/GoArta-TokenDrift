'use client';

import React, { useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import type { Container, Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/engine'; // loads tsparticles basic shape, you can choose any other bundle here
import { Particles } from '@tsparticles/react';

interface LetterParticlesProps {}

export interface LetterParticlesRef {
  emitParticlesAt: (x: number, y: number) => void;
}

const LetterParticles = forwardRef<LetterParticlesRef, LetterParticlesProps>((props, ref) => {
  const particlesContainerRef = useRef<Container | null>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    particlesContainerRef.current = container || null;
    console.log('Particles container loaded', container);
  }, []);

  useImperativeHandle(ref, () => ({
    emitParticlesAt: (x: number, y: number) => {
      if (particlesContainerRef.current) {
        // Emit particles at the given x, y coordinates
        particlesContainerRef.current.particles.addParticle({
          x: x,
          y: y,
          // You can override particle properties here if needed
          // For example, to ensure they are visible
          // color: { value: "#FF0000" },
          // size: { value: 10 },
          // opacity: { value: 1 },
        });
      }
    },
  }));

  const options = {
    background: {
      color: {
        value: 'transparent', // No background
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: false, // No click interaction
          mode: 'push',
        },
        onHover: {
          enable: false, // No hover interaction
          mode: 'repulse',
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      number: {
        value: 0, // No particles on load, only emit on trigger
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        // Gradient colors (purple #54529E → pink #AB398E)
        value: ['#54529E', '#824A97', '#AB398E'],
      },
      shape: {
        type: ['circle', 'triangle'], // Circles and triangles
        // Optionally add a custom shape using emoji 🎵 for music feel.
        // This requires a custom shape definition, which is more complex.
        // For now, stick to basic shapes.
        // custom: {
        //   options: {
        //     musicNote: {
        //       path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2z"
        //     }
        //   }
        // }
      },
      opacity: {
        value: 1, // Start fully opaque
        random: false,
        animation: {
          enable: true,
          speed: 0.8, // Fade out over life
          minimumValue: 0,
          sync: false,
        },
      },
      size: {
        value: { min: 2, max: 6 }, // Small (2px–6px, random)
        random: true,
        animation: {
          enable: false,
        },
      },
      links: {
        enable: false, // No links between particles
      },
      move: {
        enable: true,
        speed: { min: 1, max: 3 }, // Upward drift with slight random sideways movement
        direction: 'top',
        random: true,
        straight: false,
        outModes: {
          default: 'destroy', // Particles disappear when out of view
        },
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    detectRetina: true,
    // Cap max active particles at ~200.
    // This is handled by the "destroy" outMode and not adding too many at once.
    // If more control is needed, a custom particle remover could be implemented.
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options as any} // Cast to any due to potential type mismatch with options
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // No interaction with particles
        zIndex: 50, // Overlay above background but below interactive UI
      }}
    />
  );
});

LetterParticles.displayName = 'LetterParticles';

export default LetterParticles;
