"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// TypeScript interfaces
interface TravelData {
  place: string;
  title: string;
  title2: string;
  description: string;
  image: string;
}

interface CarouselProps {
  autoLoop?: boolean;
  loopDelay?: number;
}

const TravelCarousel: React.FC<CarouselProps> = ({ 
  autoLoop = true, 
  loopDelay = 3000 
}) => {
  // Data
  const data: TravelData[] = [
    {
      place: 'Switzerland Alps',
      title: 'SAINT',
      title2: 'ANTONIEN',
      description: "Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.",
      image: 'https://assets.codepen.io/3685267/timed-cards-1.jpg'
    },
    {
      place: 'Japan Alps',
      title: 'NANGANO',
      title2: 'PREFECTURE',
      description: "Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country's best powder.",
      image: 'https://assets.codepen.io/3685267/timed-cards-2.jpg'
    },
    {
      place: 'Sahara Desert - Morocco',
      title: 'MARRAKECH',
      title2: 'MEROUGA',
      description: 'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.',
      image: 'https://assets.codepen.io/3685267/timed-cards-3.jpg'
    },
    {
      place: 'Sierra Nevada - USA',
      title: 'YOSEMITE',
      title2: 'NATIONAL PARK',
      description: 'Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.',
      image: 'https://assets.codepen.io/3685267/timed-cards-4.jpg'
    },
    {
      place: 'Tarifa - Spain',
      title: 'LOS LANCES',
      title2: 'BEACH',
      description: "Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach's long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.",
      image: 'https://assets.codepen.io/3685267/timed-cards-5.jpg'
    },
    {
      place: 'Cappadocia - Turkey',
      title: 'Göreme',
      title2: 'Valley',
      description: 'Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.',
      image: 'https://assets.codepen.io/3685267/timed-cards-6.jpg'
    },
  ];

  // State
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [detailsEven, setDetailsEven] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLNavElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const detailsEvenRef = useRef<HTMLDivElement>(null);
  const detailsOddRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const cardContentRefs = useRef<HTMLDivElement[]>([]);
  const slideItemRefs = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout>();

  // Animation variables
  const offsetTopRef = useRef<number>(200);
  const offsetLeftRef = useRef<number>(700);
  const cardWidth = 200;
  const cardHeight = 300;
  const gap = 40;
  const numberSize = 50;
  const ease = "sine.inOut";

  // Load images
  const loadImages = async () => {
    const promises = data.map(({ image }) => 
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = image;
      })
    );
    
    try {
      await Promise.all(promises);
      setImagesLoaded(true);
    } catch (error) {
      console.error("One or more images failed to load", error);
      setImagesLoaded(true); // Continue anyway
    }
  };

  // Initialize animation
  const init = () => {
    const [active, ...rest] = order;
    const detailsActive = detailsEven ? detailsEvenRef.current : detailsOddRef.current;
    const detailsInactive = detailsEven ? detailsOddRef.current : detailsEvenRef.current;
    const { innerHeight: height, innerWidth: width } = window;
    
    offsetTopRef.current = height - 430;
    offsetLeftRef.current = width - 830;

    // Set initial positions
    gsap.set(paginationRef.current, {
      top: offsetTopRef.current + 330,
      left: offsetLeftRef.current,
      y: 200,
      opacity: 0,
      zIndex: 60,
    });

    gsap.set(navRef.current, { y: -200, opacity: 0 });
    
    gsap.set(cardRefs.current[active], {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    gsap.set(cardContentRefs.current[active], { x: 0, y: 0, opacity: 0 });
    gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });

    // Set inactive details
    const inactiveSelectors = ['.text', '.title-1', '.title-2', '.desc', '.cta'];
    inactiveSelectors.forEach((selector, index) => {
      const element = detailsInactive?.querySelector(selector);
      if (element) {
        gsap.set(element, { y: index < 3 ? 100 : index === 3 ? 50 : 60 });
      }
    });

    gsap.set(progressRef.current, {
      width: 500 * (1 / order.length) * (active + 1),
    });

    // Position other cards
    rest.forEach((i, index) => {
      gsap.set(cardRefs.current[i], {
        x: offsetLeftRef.current + 400 + index * (cardWidth + gap),
        y: offsetTopRef.current,
        width: cardWidth,
        height: cardHeight,
        zIndex: 30,
        borderRadius: 10,
      });

      gsap.set(cardContentRefs.current[i], {
        x: offsetLeftRef.current + 400 + index * (cardWidth + gap),
        zIndex: 40,
        y: offsetTopRef.current + cardHeight - 100,
      });

      gsap.set(slideItemRefs.current[i], { x: (index + 1) * numberSize });
    });

    gsap.set(indicatorRef.current, { x: -window.innerWidth });

    // Start animation sequence
    const startDelay = 0.6;
    gsap.to(coverRef.current, {
      x: width + 400,
      delay: 0.5,
      ease,
      onComplete: () => {
        setTimeout(() => {
          if (autoLoop) loop();
        }, 500);
      },
    });

    // Animate cards into position
    rest.forEach((i, index) => {
      gsap.to(cardRefs.current[i], {
        x: offsetLeftRef.current + index * (cardWidth + gap),
        zIndex: 30,
        delay: startDelay + 0.05 * index,
        ease,
      });
      gsap.to(cardContentRefs.current[i], {
        x: offsetLeftRef.current + index * (cardWidth + gap),
        zIndex: 40,
        delay: startDelay + 0.05 * index,
        ease,
      });
    });

    gsap.to(paginationRef.current, { y: 0, opacity: 1, ease, delay: startDelay });
    gsap.to(navRef.current, { y: 0, opacity: 1, ease, delay: startDelay });
    gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
  };

  // Step function for carousel progression
  const step = (): Promise<void> => {
    return new Promise((resolve) => {
      if (isAnimating) return resolve();
      
      setIsAnimating(true);
      
      const newOrder = [...order.slice(1), order[0]];
      const newDetailsEven = !detailsEven;
      
      setOrder(newOrder);
      setDetailsEven(newDetailsEven);
      
      const detailsActive = newDetailsEven ? detailsEvenRef.current : detailsOddRef.current;
      const detailsInactive = newDetailsEven ? detailsOddRef.current : detailsEvenRef.current;
      
      // Update content
      const activeData = data[newOrder[0]];
      if (detailsActive) {
        const textEl = detailsActive.querySelector('.text');
        const title1El = detailsActive.querySelector('.title-1');
        const title2El = detailsActive.querySelector('.title-2');
        const descEl = detailsActive.querySelector('.desc');
        
        if (textEl) textEl.textContent = activeData.place;
        if (title1El) title1El.textContent = activeData.title;
        if (title2El) title2El.textContent = activeData.title2;
        if (descEl) descEl.textContent = activeData.description;
      }

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
      
      // Animate text elements
      const textSelectors = ['.text', '.title-1', '.title-2', '.desc', '.cta'];
      const delays = [0.1, 0.15, 0.15, 0.3, 0.35];
      const durations = [0.7, 0.7, 0.7, 0.4, 0.4];
      
      textSelectors.forEach((selector, index) => {
        const element = detailsActive?.querySelector(selector);
        if (element) {
          gsap.to(element, {
            y: 0,
            delay: delays[index],
            duration: durations[index],
            ease,
            onComplete: index === textSelectors.length - 1 ? () => {
              setIsAnimating(false);
              resolve();
            } : undefined,
          });
        }
      });

      gsap.set(detailsInactive, { zIndex: 12 });

      const [active, ...rest] = newOrder;
      const prv = rest[rest.length - 1];

      gsap.set(cardRefs.current[prv], { zIndex: 10 });
      gsap.set(cardRefs.current[active], { zIndex: 20 });
      gsap.to(cardRefs.current[prv], { scale: 1.5, ease });

      gsap.to(cardContentRefs.current[active], {
        y: offsetTopRef.current + cardHeight - 10,
        opacity: 0,
        duration: 0.3,
        ease,
      });

      gsap.to(slideItemRefs.current[active], { x: 0, ease });
      gsap.to(slideItemRefs.current[prv], { x: -numberSize, ease });
      gsap.to(progressRef.current, {
        width: 500 * (1 / newOrder.length) * (active + 1),
        ease,
      });

      gsap.to(cardRefs.current[active], {
        x: 0,
        y: 0,
        ease,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        onComplete: () => {
          const xNew = offsetLeftRef.current + (rest.length - 1) * (cardWidth + gap);
          
          gsap.set(cardRefs.current[prv], {
            x: xNew,
            y: offsetTopRef.current,
            width: cardWidth,
            height: cardHeight,
            zIndex: 30,
            borderRadius: 10,
            scale: 1,
          });

          gsap.set(cardContentRefs.current[prv], {
            x: xNew,
            y: offsetTopRef.current + cardHeight - 100,
            opacity: 1,
            zIndex: 40,
          });

          gsap.set(slideItemRefs.current[prv], { x: rest.length * numberSize });
          gsap.set(detailsInactive, { opacity: 0 });

          // Reset inactive details
          const inactiveSelectors = ['.text', '.title-1', '.title-2', '.desc', '.cta'];
          inactiveSelectors.forEach((selector, index) => {
            const element = detailsInactive?.querySelector(selector);
            if (element) {
              gsap.set(element, { y: index < 3 ? 100 : index === 3 ? 50 : 60 });
            }
          });
        },
      });

      // Animate remaining cards
      rest.forEach((i, index) => {
        if (i !== prv) {
          const xNew = offsetLeftRef.current + index * (cardWidth + gap);
          gsap.set(cardRefs.current[i], { zIndex: 30 });
          gsap.to(cardRefs.current[i], {
            x: xNew,
            y: offsetTopRef.current,
            width: cardWidth,
            height: cardHeight,
            ease,
            delay: 0.1 * (index + 1),
          });
          gsap.to(cardContentRefs.current[i], {
            x: xNew,
            y: offsetTopRef.current + cardHeight - 100,
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1),
          });
          gsap.to(slideItemRefs.current[i], { x: (index + 1) * numberSize, ease });
        }
      });
    });
  };

  // Loop function
  const loop = async () => {
    if (!autoLoop) return;
    
    await new Promise(resolve => {
      gsap.to(indicatorRef.current, {
        x: 0,
        duration: 2,
        onComplete: resolve
      });
    });
    
    await new Promise(resolve => {
      gsap.to(indicatorRef.current, {
        x: window.innerWidth,
        duration: 0.8,
        delay: 0.3,
        onComplete: resolve
      });
    });
    
    gsap.set(indicatorRef.current, { x: -window.innerWidth });
    await step();
    
    loopTimeoutRef.current = setTimeout(loop, loopDelay);
  };

  // Manual navigation
  const handlePrevious = () => {
    if (!isAnimating) {
      const newOrder = [order[order.length - 1], ...order.slice(0, -1)];
      setOrder(newOrder);
      step();
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      step();
    }
  };

  // Effects
  useEffect(() => {
    loadImages();
    
    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (imagesLoaded) {
      init();
    }
  }, [imagesLoaded]);

  useEffect(() => {
    const handleResize = () => {
      const { innerHeight: height, innerWidth: width } = window;
      offsetTopRef.current = height - 430;
      offsetLeftRef.current = width - 830;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    container: {
      margin: 0,
      backgroundColor: '#1a1a1a',
      color: '#FFFFFFDD',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      fontFamily: '"Inter", sans-serif',
      width: '100vw',
      height: '100vh',
    },
    nav: {
      position: 'fixed' as const,
      left: 0,
      top: 0,
      right: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 36px',
      fontWeight: 500,
    },
    navLeft: {
      display: 'inline-flex',
      alignItems: 'center',
      textTransform: 'uppercase' as const,
      fontSize: '14px',
      gap: '10px',
    },
    navRight: {
      display: 'inline-flex',
      alignItems: 'center',
      textTransform: 'uppercase' as const,
      fontSize: '14px',
      gap: '24px',
    },
    navActive: {
      position: 'relative' as const,
    },
    navActiveAfter: {
      content: '""',
      position: 'absolute' as const,
      bottom: '-8px',
      left: 0,
      right: 0,
      height: '3px',
      borderRadius: '99px',
      backgroundColor: '#ecad29',
    },
    svgContainer: {
      width: '20px',
      height: '20px',
    },
    svg: {
      width: '20px',
      height: '20px',
    },
    indicator: {
      position: 'fixed' as const,
      left: 0,
      right: 0,
      top: 0,
      height: '5px',
      zIndex: 60,
      backgroundColor: '#ecad29',
    },
    card: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      boxShadow: '6px 6px 10px 2px rgba(0, 0, 0, 0.6)',
    },
    cardContent: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      color: '#FFFFFFDD',
      paddingLeft: '16px',
    },
    contentStart: {
      width: '30px',
      height: '5px',
      borderRadius: '99px',
      backgroundColor: '#FFFFFFDD',
    },
    contentPlace: {
      marginTop: '6px',
      fontSize: '13px',
      fontWeight: 500,
    },
    contentTitle: {
      fontWeight: 600,
      fontSize: '20px',
      fontFamily: '"Oswald", sans-serif',
    },
    details: {
      zIndex: 22,
      position: 'absolute' as const,
      top: '240px',
      left: '60px',
    },
    placeBox: {
      height: '46px',
      overflow: 'hidden' as const,
    },
    placeBoxText: {
      paddingTop: '16px',
      fontSize: '20px',
      position: 'relative' as const,
    },
    placeBoxTextBefore: {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '30px',
      height: '4px',
      borderRadius: '99px',
      backgroundColor: 'white',
    },
    titleBox: {
      marginTop: '2px',
      height: '100px',
      overflow: 'hidden' as const,
    },
    title: {
      fontWeight: 600,
      fontSize: '72px',
      fontFamily: '"Oswald", sans-serif',
    },
    desc: {
      marginTop: '16px',
      width: '500px',
    },
    cta: {
      width: '500px',
      marginTop: '24px',
      display: 'flex',
      alignItems: 'center',
    },
    bookmark: {
      border: 'none',
      backgroundColor: '#ecad29',
      width: '36px',
      height: '36px',
      borderRadius: '99px',
      color: 'white',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
    },
    discover: {
      border: '1px solid #ffffff',
      backgroundColor: 'transparent',
      height: '36px',
      borderRadius: '99px',
      color: '#ffffff',
      padding: '4px 24px',
      fontSize: '12px',
      marginLeft: '16px',
      textTransform: 'uppercase' as const,
      cursor: 'pointer',
    },
    pagination: {
      position: 'absolute' as const,
      left: '0px',
      top: '0px',
      display: 'inline-flex',
    },
    arrow: {
      zIndex: 60,
      width: '50px',
      height: '50px',
      borderRadius: '999px',
      border: '2px solid #ffffff55',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
    },
    arrowRight: {
      marginLeft: '20px',
    },
    progressContainer: {
      marginLeft: '24px',
      zIndex: 60,
      width: '500px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
    },
    progressBackground: {
      width: '500px',
      height: '3px',
      backgroundColor: '#ffffff33',
    },
    progressForeground: {
      height: '3px',
      backgroundColor: '#ecad29',
    },
    slideNumbers: {
      width: '50px',
      height: '50px',
      overflow: 'hidden' as const,
      zIndex: 60,
      position: 'relative' as const,
    },
    slideItem: {
      width: '50px',
      height: '50px',
      position: 'absolute' as const,
      color: 'white',
      top: 0,
      left: 0,
      display: 'grid',
      placeItems: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
    },
    cover: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#fff',
      zIndex: 100,
    },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500&display=swap" rel="stylesheet" />
      <div ref={containerRef} style={styles.container}>
        <div ref={indicatorRef} style={styles.indicator}></div>
        
        <nav ref={navRef} style={styles.nav}>
          <div style={styles.navLeft}>
            <div style={styles.svgContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={styles.svg}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <div>Globe Express</div>
          </div>
          <div style={styles.navRight}>
            <div style={styles.navActive}>
              Home
              <div style={styles.navActiveAfter}></div>
            </div>
            <div>Holidays</div>
            <div>Destinations</div>
            <div>Flights</div>
            <div>Offers</div>
            <div>Contact</div>
            <div style={styles.svgContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={styles.svg}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <div style={styles.svgContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={styles.svg}>
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </nav>

        {/* Cards */}
        {data.map((item, index) => (
          <div key={index}>
            <div
              ref={el => cardRefs.current[index] = el!}
              style={{
                ...styles.card,
                backgroundImage: `url(${item.image})`,
              }}
            />
            <div
              ref={el => cardContentRefs.current[index] = el!}
              style={styles.cardContent}
            >
              <div style={styles.contentStart}></div>
              <div style={styles.contentPlace}>{item.place}</div>
              <div style={styles.contentTitle}>{item.title}</div>
              <div style={styles.contentTitle}>{item.title2}</div>
            </div>
          </div>
        ))}

        {/* Details sections */}
        <div ref={detailsEvenRef} style={styles.details}>
          <div style={styles.placeBox}>
            <div className="text" style={styles.placeBoxText}>
              <div style={styles.placeBoxTextBefore}></div>
              {data[0].place}
            </div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-1" style={styles.title}>{data[0].title}</div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-2" style={styles.title}>{data[0].title2}</div>
          </div>
          <div className="desc" style={styles.desc}>
            {data[0].description}
          </div>
          <div className="cta" style={styles.cta}>
            <button style={styles.bookmark}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={styles.svg}>
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            </button>
            <button style={styles.discover}>Discover Location</button>
          </div>
        </div>

        <div ref={detailsOddRef} style={styles.details}>
          <div style={styles.placeBox}>
            <div className="text" style={styles.placeBoxText}>
              <div style={styles.placeBoxTextBefore}></div>
              {data[0].place}
            </div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-1" style={styles.title}>{data[0].title}</div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-2" style={styles.title}>{data[0].title2}</div>
          </div>
          <div className="desc" style={styles.desc}>
            {data[0].description}
          </div>
          <div className="cta" style={styles.cta}>
            <button style={styles.bookmark}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={styles.svg}>
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            </button>
            <button style={styles.discover}>Discover Location</button>
          </div>
        </div>

        {/* Pagination */}
        <div ref={paginationRef} style={styles.pagination}>
          <div style={styles.arrow} onClick={handlePrevious}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={styles.svg}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
          <div style={{...styles.arrow, ...styles.arrowRight}} onClick={handleNext}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={styles.svg}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressBackground}>
              <div ref={progressRef} style={styles.progressForeground}></div>
            </div>
          </div>
          <div style={styles.slideNumbers}>
            {data.map((_, index) => (
              <div
                key={index}
                ref={el => slideItemRefs.current[index] = el!}
                style={styles.slideItem}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div ref={coverRef} style={styles.cover}></div>
      </div>
    </>
  );
};

export default TravelCarousel;