'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Slides data
const slidesData = [
  {
    id: 1,
    image: '/images/image1.webp',
    alt: 'Leave city congestion behind and choose a stress-free commute through the clouds.',
    description: 'Leave city congestion behind and choose a stress-free commute through the clouds.',
    isFirst: true,
    isLast: false,
  },
  {
    id: 2,
    image: '/images/image2.webp',
    alt: 'Sit back and enjoy. Breathtaking views come standard with every seat.',
    description: 'Sit back and enjoy. Breathtaking views come standard with every seat.',
    isFirst: false,
    isLast: false,
  },
  {
    id: 3,
    image: '/images/image3.webp',
    alt: 'Enjoy seamless travel with a choreographed rideshare to the vertiport.',
    description: 'Enjoy seamless travel with a choreographed rideshare to the vertiport.',
    isFirst: false,
    isLast: true,
  },
]

export default function Home() {
  const stickyOuterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const CLS = {
      slide: "experience-highlights__slide",
      content: "experience-highlights__content",
      slideImage: "experience-highlights__slide-image"
    }

    const stickyOuter = stickyOuterRef.current
    if (!stickyOuter) return

    const slides = gsap.utils.toArray<HTMLElement>("." + CLS.slide)
    const titleEl = stickyOuter.querySelector<HTMLElement>(".experience-highlights__title")

    if (!titleEl) return

    const mm = gsap.matchMedia()

    // Desktop / Tablet Animation (width > 768px)
    mm.add("(min-width: 769px)", () => {
      stickyOuter.style.minHeight = (slides.length * 125 + 200) + "vh"

      const n = 0.9 / slides.length

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyOuter,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      })

      ScrollTrigger.create({
        trigger: stickyOuter,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
          stickyOuter.style.backgroundColor = "#f5f4df"
          stickyOuter.style.color = "#0e1620"
        },
        onLeaveBack: () => {
          stickyOuter.style.backgroundColor = ""
          stickyOuter.style.color = ""
        }
      })

      gsap.to(titleEl, {
        scale: 0.3,
        y: -100,
        ease: "power1.inOut",
        duration: 1,
        scrollTrigger: {
          trigger: stickyOuter,
          start: "top top",
          end: "+=155%",
          scrub: 1,
        }
      })

      slides.forEach((slide, d) => {
        const contentEl = slide.querySelector<HTMLElement>("." + CLS.content)
        const imageEl = slide.querySelector<HTMLElement>("." + CLS.slideImage)
        if (!contentEl || !imageEl) return

        const m = d * n
        const end = m + n
        const isLast = d === slides.length - 1

        const originWhileEntering = d === 0 ? "center bottom" : "right bottom"
        const originAfterEntered = "left top"

        tl.call(() => { imageEl.style.transformOrigin = originWhileEntering }, [], m)
        tl.call(() => { imageEl.style.transformOrigin = originWhileEntering }, [], end - 0.001)
        tl.call(() => { imageEl.style.transformOrigin = originAfterEntered }, [], end)

        tl.to(slide, {
          "--slide-progress-before": 1,
          ease: "power1.inOut",
          duration: 0.4 * n
        }, Math.max(m - 0.75 * n, 0))

        tl.set(contentEl, { visibility: "hidden" }, m + n * 0.3 - 0.001)
        tl.set(contentEl, { visibility: "visible" }, m + n * 0.3)

        tl.to(slide, {
          "--slide-progress-in": 1,
          ease: "power1.inOut",
          duration: n
        }, m)

        if (!isLast) {
          tl.to(slide, {
            "--slide-progress-out": 1,
            ease: "power1.inOut",
            duration: 0.9 * n
          }, end + 0.05 * n)

          tl.set(contentEl, { visibility: "hidden" }, end + 0.05 * n + 0.25 * n)
        }

        if (d < slides.length - 2) {
          tl.to(slide, {
            "--slide-progress-end": 1,
            ease: "power1.inOut",
            duration: n
          }, end + n)
        }
      })

      gsap.to(slides[slides.length - 1], {
        "--slide-progress-last-child-out": 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: stickyOuter,
          start: "bottom bottom",
          end: "+=60% bottom",
          scrub: true
        }
      })

      // Cleanup function for desktop - runs when switching to mobile
      return () => {
        gsap.killTweensOf(titleEl)
        gsap.set(titleEl, { clearProps: "transform,fontSize,opacity,visibility" })
        titleEl.classList.remove("is-unstuck")

        slides.forEach((slide) => {
          gsap.killTweensOf(slide)
          slide.style.removeProperty("--slide-progress-before")
          slide.style.removeProperty("--slide-progress-in")
          slide.style.removeProperty("--slide-progress-out")
          slide.style.removeProperty("--slide-progress-end")
          slide.style.removeProperty("--slide-progress-last-child-out")

          const imageEl = slide.querySelector<HTMLElement>("." + CLS.slideImage)
          if (imageEl) imageEl.style.transformOrigin = ""

          const contentEl = slide.querySelector<HTMLElement>("." + CLS.content)
          if (contentEl) contentEl.style.removeProperty("visibility")
        })

        stickyOuter.style.minHeight = ""
        stickyOuter.style.backgroundColor = ""
        stickyOuter.style.color = ""
      }
    })

    // Mobile Animation (width <= 768px)
    mm.add("(max-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: stickyOuter,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
          stickyOuter.style.backgroundColor = "#f5f4df"
          stickyOuter.style.color = "#0e1620"
        },
        onLeaveBack: () => {
          stickyOuter.style.backgroundColor = ""
          stickyOuter.style.color = ""
        }
      })

      slides.forEach((slide, slideIndex) => {
        const contentEl = slide.querySelector<HTMLElement>("." + CLS.content)
        const imageEl = slide.querySelector<HTMLElement>("." + CLS.slideImage)
        if (!contentEl || !imageEl) return

        const isLastSlide = slideIndex === slides.length - 1

        gsap.set(contentEl, { visibility: "visible" })
        gsap.set(slide, {
          "--slide-progress-before": 0,
          "--slide-progress-in": 0,
          "--slide-progress-out": 0
        })
        imageEl.style.transformOrigin = "0 100%"

        // Scale-in animation when slide enters viewport
        const inTl = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            start: "top 95%",
            end: "top 35%",
            scrub: true
          }
        })
        inTl.to(slide, {
          "--slide-progress-before": 1,
          "--slide-progress-in": 1,
          ease: "none"
        })

        // Skip scale-out animation for the last slide
        if (!isLastSlide) {
          const outTl = gsap.timeline({
            scrollTrigger: {
              trigger: slide,
              start: "bottom 55%",
              end: "bottom -20%",
              scrub: true,
              onUpdate: (self) => {
                imageEl.style.transformOrigin = self.progress > 0.01 ? "left top" : "0 100%"
              }
            }
          })
          outTl.to(slide, {
            "--slide-progress-out": 1,
            ease: "none"
          })
        }
      })

      gsap.set(titleEl, { clearProps: "transform" })

      // Cleanup function for mobile - runs when switching to desktop
      return () => {
        slides.forEach((slide) => {
          gsap.killTweensOf(slide)
          slide.style.removeProperty("--slide-progress-before")
          slide.style.removeProperty("--slide-progress-in")
          slide.style.removeProperty("--slide-progress-out")

          const imageEl = slide.querySelector<HTMLElement>("." + CLS.slideImage)
          if (imageEl) imageEl.style.transformOrigin = ""

          const contentEl = slide.querySelector<HTMLElement>("." + CLS.content)
          if (contentEl) contentEl.style.removeProperty("visibility")
        })

        stickyOuter.style.backgroundColor = ""
        stickyOuter.style.color = ""
      }
    })

    // Cleanup on component unmount
    return () => {
      mm.revert()
    }
  }, [])

  return (
    <>
      {/* Spacer - Desktop/Tablet only */}
      <div className="h-[60vh] flex items-center justify-center bg-[#eee] text-[2rem] flex">
        Scroll down
      </div>

      {/* Main Experience Section */}
      <div 
        ref={stickyOuterRef} 
        id="stickyOuter" 
        className="experience-highlights w-full min-h-screen bg-custom-blue text-white relative px-[var(--base-padding)] py-[3.2rem] pb-[18.8rem] md:py-[3.2rem] md:pb-[18.8rem] max-md:px-[1.6rem] max-md:py-[2.4rem] max-md:pb-[8rem] max-md:min-h-auto"
      >
        {/* Title */}
        <h2 
          className="experience-highlights__title text-center font-sans font-bold text-[140px] leading-[120%] w-full pt-0 sticky top-[2rem] z-[3] origin-[center_top] text-current max-md:relative max-md:top-0 max-md:text-[4.4rem] max-md:mb-[3.2rem]"
          style={{ fontVariationSettings: '"wght" 550' }}
        >
          Nowhere to go but Up
        </h2>

        {/* Slides Container */}
        <div className="experience-highlights__slides w-full h-[calc(100dvh-5rem)] sticky top-[2rem] left-0 overflow-hidden max-md:h-auto max-md:relative max-md:top-0 max-md:overflow-visible max-md:flex max-md:flex-col max-md:items-center max-md:gap-[4rem]">
          
          {/* Map through slides data */}
          {slidesData.map((slide, index) => (
            <div 
              key={slide.id}
              className={`experience-highlights__slide slide-animations ${slide.isFirst ? 'slide-first' : ''} ${slide.isLast ? 'slide-last' : ''} w-full h-full px-[var(--base-padding)] grid absolute top-0 left-0 gap-x-[var(--gutter-width)] max-md:relative max-md:top-auto max-md:left-auto max-md:w-full max-md:h-fit max-md:p-0 max-md:block`}
              style={{ 
                '--slide-index': index,
                gridTemplateColumns: 'repeat(var(--grid-columns), 1fr)'
              } as React.CSSProperties}
            >
              {/* Image Container */}
              <div className="experience-highlights__slide-image slide-image-transform w-[calc(100%-2rem)] h-full place-self-center overflow-hidden origin-[100%_100%] [grid-column:5/span_8] max-md:w-full max-md:h-[36rem] max-md:[grid-column:unset] max-md:place-self-auto max-md:origin-[0_100%]">
                <img
                  alt={slide.alt}
                  className="experience-highlights__image slide-image-inner w-full h-full object-cover block origin-[50%_20%]"
                  src={slide.image}
                />
              </div>
              
              {/* Content Card */}
              <a 
                className="experience-highlights__content slide-content-transform flex flex-col gap-[2rem] [grid-column:13/span_3] self-center relative z-[3] no-underline bg-custom-beige text-custom-dark px-0 py-[3.2rem] rounded-[1.6rem] invisible max-md:opacity-100 max-md:visible max-md:relative max-md:[grid-column:unset] max-md:mt-[1.2rem] max-md:px-[1.6rem] max-md:py-[2rem] max-md:gap-[1.2rem] max-md:flex-row" 
                href="#"
              >
                <span className="experience-highlights__content-number opacity-0 hidden max-md:block max-md:opacity-100">
                  <span>{slide.id}</span>
                </span>
                <p className="m-0 text-[18px] leading-[1.2] text-custom-dark font-medium max-md:text-[12px]">
                  {slide.description}
                </p>
                <span className="experience-highlights__link opacity-100 text-custom-dark text-[14px] font-medium underline underline-offset-4 max-md:text-[13px] max-md:hidden">
                  Discover the Experience
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* End Spacer - Desktop/Tablet only */}
      <div className="h-[60vh] flex items-center justify-center bg-white text-black text-[2rem]  flex">
        Section end content
      </div>
    </>
  )
}
