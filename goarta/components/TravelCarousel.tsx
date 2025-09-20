"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

// TypeScript interfaces
interface EventData {
  id: number;
  title: string;
  date: string;
  places: string;
  description: string;
  image: string;
  image_url?: string; // Optional field from Supabase
  alt: string;
}

interface CarouselProps {
  autoLoop?: boolean;
  loopDelay?: number;
}

const UpcomingEventsCarousel: React.FC<CarouselProps> = ({
  autoLoop = true,
  loopDelay = 8000
}) => {
  // State
  const [events, setEvents] = useState<EventData[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [detailsEven, setDetailsEven] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const detailsEvenRef = useRef<HTMLDivElement>(null);
  const detailsOddRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const cardContentRefs = useRef<HTMLDivElement[]>([]);
  const slideItemRefs = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to create URL-friendly slugs
  const slugify = (text: string) => {
    return text.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')            // Trim - from start of text
      .replace(/-+$/, '');           // Trim - from end of text
  };

  // Animation variables
  const offsetTopRef = useRef<number>(200);
  const offsetLeftRef = useRef<number>(700);
  const cardWidth = 200;
  const cardHeight = 300;
  const gap = 40;
  const numberSize = 50;
  const ease = "sine.inOut";

  // Fetch events data
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: EventData[] = await response.json();

      // Use the actual event images from the database
      const eventsWithImages = data.map((event, index) => {
        // Use the image field which should now contain the correct image URL
        if (event.image && event.image.trim() !== '') {
          return {
            ...event,
            alt: `Image for ${event.title}`
          };
        }
        // Use a fallback image URL if no image is available
        return {
          ...event,
          image: `https://picsum.photos/800/600?random=${index + 1}`,
          alt: `Image for ${event.title}`
        };
      });

      setEvents(eventsWithImages);
      setOrder(eventsWithImages.map((_, index) => index));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load images
  const loadImages = useCallback(async () => {
    if (events.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const promises = events.map(({ image }) =>
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
  }, [events]);

  // Step function for carousel progression
  const step = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (isAnimating || events.length === 0) return resolve();

      setIsAnimating(true);

      const newOrder = [...order.slice(1), order[0]];
      const newDetailsEven = !detailsEven;

      setOrder(newOrder);
      setDetailsEven(newDetailsEven);

      const detailsActive = newDetailsEven ? detailsEvenRef.current : detailsOddRef.current;
      const detailsInactive = newDetailsEven ? detailsOddRef.current : detailsEvenRef.current;

      // Update content
      const activeData = events[newOrder[0]];
      if (detailsActive) {
        const textEl = detailsActive.querySelector('.text');
        const title1El = detailsActive.querySelector('.title-1');
        const title2El = detailsActive.querySelector('.title-2');
        const descEl = detailsActive.querySelector('.desc');

        if (textEl) textEl.textContent = activeData.date;
        if (title1El) title1El.textContent = activeData.title;
        if (title2El) title2El.textContent = activeData.places;
        if (descEl) descEl.textContent = activeData.description;
      }

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, delay: 0.8, ease, duration: 1.5 });

      // Animate text elements
      const textSelectors = ['.text', '.title-1', '.title-2', '.desc', '.cta'];
      const delays = [0.2, 0.3, 0.3, 0.6, 0.7];
      const durations = [1.0, 1.0, 1.0, 0.8, 0.8];

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
      gsap.to(cardRefs.current[prv], { scale: 1.5, ease, duration: 1.2 });

      gsap.to(cardContentRefs.current[active], {
        y: offsetTopRef.current + cardHeight - 10,
        opacity: 0,
        duration: 0.6,
        ease,
      });

      gsap.to(slideItemRefs.current[active], { x: 0, ease, duration: 1.0 });
      gsap.to(slideItemRefs.current[prv], { x: -numberSize, ease, duration: 1.0 });
      gsap.to(progressRef.current, {
        width: 500 * (1 / newOrder.length) * (active + 1),
        ease,
        duration: 1.0,
      });

      gsap.to(cardRefs.current[active], {
        x: 0,
        y: 0,
        ease,
        duration: 1.5,
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
            duration: 1.2,
            delay: 0.2 * (index + 1),
          });
          gsap.to(cardContentRefs.current[i], {
            x: xNew,
            y: offsetTopRef.current + cardHeight - 100,
            opacity: 1,
            zIndex: 40,
            ease,
            duration: 1.2,
            delay: 0.2 * (index + 1),
          });
          gsap.to(slideItemRefs.current[i], { x: (index + 1) * numberSize, ease, duration: 1.0 });
        }
      });
    });
  }, [detailsEven, events, isAnimating, order]);

  // Loop function
  const loop = useCallback(async () => {
    if (!autoLoop) return;

    await step();

    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
    loopTimeoutRef.current = setTimeout(loop, loopDelay);
  }, [autoLoop, loopDelay, step]);

  // Initialize animation
  const init = useCallback(() => {
    if (events.length === 0) return;

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

    // Start animation sequence
    const startDelay = 1.2;
    gsap.to(coverRef.current, {
      x: width + 400,
      delay: 1.0,
      ease,
      duration: 1.5,
      onComplete: () => {
        setTimeout(() => {
          if (autoLoop) loop();
        }, 1000);
      },
    });

    // Animate cards into position
    rest.forEach((i, index) => {
      gsap.to(cardRefs.current[i], {
        x: offsetLeftRef.current + index * (cardWidth + gap),
        zIndex: 30,
        delay: startDelay + 0.1 * index,
        ease,
        duration: 1.5,
      });
      gsap.to(cardContentRefs.current[i], {
        x: offsetLeftRef.current + index * (cardWidth + gap),
        zIndex: 40,
        delay: startDelay + 0.1 * index,
        ease,
        duration: 1.5,
      });
    });

    gsap.to(paginationRef.current, { y: 0, opacity: 1, ease, delay: startDelay, duration: 1.0 });
    gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay, duration: 1.5 });
  }, [autoLoop, detailsEven, ease, events.length, loop, order]);

  // Manual navigation
  const handlePrevious = () => {
    if (!isAnimating && events.length > 0) {
      const newOrder = [order[order.length - 1], ...order.slice(0, -1)];
      setOrder(newOrder);
      step();
    }
  };

  const handleNext = () => {
    if (!isAnimating && events.length > 0) {
      step();
    }
  };

  // Effects
  useEffect(() => {
    fetchEvents();

    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && !error && events.length > 0) {
      loadImages();
    }
  }, [loading, error, events, loadImages]);

  useEffect(() => {
    if (imagesLoaded && events.length > 0) {
      init();
    }
  }, [imagesLoaded, events, init]);

  useEffect(() => {
    const handleResize = () => {
      const { innerHeight: height, innerWidth: width } = window;
      offsetTopRef.current = height - 430;
      offsetLeftRef.current = width - 830;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Styles
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
    card: {
      position: 'absolute' as const,
      left: 0,
      top: 0,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      boxShadow: '6px 6px 10px 2px rgba(0, 0, 0, 0.6)',
      width: '100%',
      height: '100%',
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
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
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
    // New styles for "Upcoming Events" text on the left
    upcomingEventsText: {
      position: 'absolute' as const,
      top: '100px',
      left: '60px',
      zIndex: 30,
      color: 'white',
    },
    upcomingEventsTitle: {
      fontSize: '24px',
      fontWeight: 600,
      marginBottom: '10px',
      color: '#ecad29',
    },
    upcomingEventsSubtitle: {
      fontSize: '48px',
      fontWeight: 700,
      fontFamily: '"Oswald", sans-serif',
      lineHeight: '1.2',
    },
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '24px' }}>Loading upcoming events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'red', fontSize: '24px' }}>Error: {error}</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '24px' }}>No upcoming events at the moment.</div>
      </div>
    );
  }

  // Helper function to safely set refs
  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current[index] = el;
  };

  const setCardContentRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) cardContentRefs.current[index] = el;
  };

  const setSlideItemRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) slideItemRefs.current[index] = el;
  };

  return (
    <>

      <div ref={containerRef} style={styles.container}>
        {/* "Upcoming Events" text on the left side */}
        <div style={styles.upcomingEventsText}>
          <div style={styles.upcomingEventsTitle}>UPCOMING</div>
          <div style={styles.upcomingEventsSubtitle}>Events</div>
        </div>

        {/* Cards */}
        {events.map((event, index) => (
          <div key={event.id}>
            <Link href={`/events/${slugify(event.title)}`}>
              <div
                ref={setCardRef(index)}
                style={{
                  ...styles.card,
                  backgroundImage: `url(${event.image})`,
                }}
              />
            </Link>
            <div
              ref={setCardContentRef(index)}
              style={styles.cardContent}
            >
              <div style={styles.contentStart}></div>
              <div style={styles.contentPlace}>{event.date}</div>
              <div style={styles.contentTitle}>{event.title}</div>
              <div style={styles.contentTitle}>{event.places}</div>
            </div>
          </div>
        ))}

        {/* Details sections */}
        <div ref={detailsEvenRef} style={styles.details}>
          <div style={styles.placeBox}>
            <div className="text" style={styles.placeBoxText}>
              <div style={styles.placeBoxTextBefore}></div>
              {events.length > 0 ? events[0].date : ''}
            </div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-1 " style={styles.title}>{events.length > 0 ? events[0].title : ''}</div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-2" style={styles.title}>{events.length > 0 ? events[0].places : ''}</div>
          </div>
          <div className="desc" style={styles.desc}>
            {events.length > 0 ? events[0].description : ''}
          </div>
          <div className="cta" style={styles.cta}>
            <button style={styles.bookmark}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={detailsOddRef} style={styles.details}>
          <div style={styles.placeBox}>
            <div className="text" style={styles.placeBoxText}>
              <div style={styles.placeBoxTextBefore}></div>
              {events.length > 1 ? events[1].date : (events.length > 0 ? events[0].date : '')}
            </div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-1" style={styles.title}>{events.length > 1 ? events[1].title : (events.length > 0 ? events[0].title : '')}</div>
          </div>
          <div style={styles.titleBox}>
            <div className="title-2" style={styles.title}>{events.length > 1 ? events[1].places : (events.length > 0 ? events[0].places : '')}</div>
          </div>
          <div className="desc" style={styles.desc}>
            {events.length > 1 ? events[1].description : (events.length > 0 ? events[0].description : '')}
          </div>
          <div className="cta" style={styles.cta}>
            <button style={styles.bookmark}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pagination */}
        <div ref={paginationRef} style={styles.pagination}>
          <div style={styles.arrow} onClick={handlePrevious}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
          <div style={{ ...styles.arrow, ...styles.arrowRight }} onClick={handleNext}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.progressBackground}>
              <div ref={progressRef} style={styles.progressForeground}></div>
            </div>
          </div>
          <div style={styles.slideNumbers}>
            {events.map((_, index) => (
              <div
                key={index}
                ref={setSlideItemRef(index)}
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

export default UpcomingEventsCarousel;