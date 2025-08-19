'use client'

import { Splide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Room } from '../../types/room'
import AddRoomSlide from './AddRoomSlide'
import RoomInfo from './RoomInfo'
import RoomSlide from './RoomSlide'

type SwiperModalProps = {
    show: boolean
    rooms: Room[]
    index: number
    currentSlide: number
    active?: Room
    isSwiping: boolean
    onClose: () => void
    onAddRoom: () => void
    onFavorite: (roomId: string) => void
    onDuplicate: (roomId: string) => void
    setIndex: (idx: number) => void
    setCurrentSlide: (idx: number) => void
    setIsSwiping: (v: boolean) => void
    setLastRoomIndex: (idx: number) => void
}

const SwiperModal = ({
    show,
    rooms,
    index,
    currentSlide,
    active,
    isSwiping,
    onClose,
    onAddRoom,
    onFavorite,
    onDuplicate,
    setIndex,
    setCurrentSlide,
    setIsSwiping,
    setLastRoomIndex,
}: SwiperModalProps) => {
    const splide = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    // Helper: jump without animation if possible, fallback to go()
    const jumpTo = (i: number) => {
        const s = splide.current
        if (!s) return
        // Try internal non-animated jump (available in Splide)
        if (s.Components?.Move?.jump) {
            s.Components.Move.jump(i)
        } else {
            s.go(i)
        }
    }

    // Robust recenter: refresh -> jump to currentSlide
    const refreshAndCenter = () => {
        if (!splide.current) return
        // Force Splide to recalc layout based on final size
        splide.current.refresh()
        jumpTo(currentSlide)
    }

    useEffect(() => {
        if (!show || !splide.current) return
        // Small timeout in case framer-motion completes asynchronously
        const t = setTimeout(refreshAndCenter, 0)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    // As the currentSlide changes from outside, keep Splide aligned.
    useEffect(() => {
        if (!show || !splide.current) return
        jumpTo(currentSlide)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSlide])

    useEffect(() => {
        if (!show || !containerRef.current) return
        const ro = new ResizeObserver(() => {
            refreshAndCenter()
        })
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [show])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div className="bg-dark" />
                    <motion.div
                        ref={containerRef}
                        className="swiper-container"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        onAnimationComplete={refreshAndCenter}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="swiper-content">
                            <Splide
                                options={{
                                    arrows: false,
                                    pagination: false,
                                    gap: '30px',
                                    padding: '15rem',
                                    focus: 'center',
                                    trimSpace: false,
                                    rewind: rooms.length > 1,
                                }}
                                onMounted={(instance) => {
                                    splide.current = instance
                                }}
                                onResized={refreshAndCenter}
                                onDrag={() => setIsSwiping(true)}
                                onMove={() => setIsSwiping(true)}
                                onMoved={(_, newIndex) => {
                                    setCurrentSlide(newIndex)
                                    setIndex(newIndex)
                                    setIsSwiping(false)
                                    if (newIndex < rooms.length)
                                        setLastRoomIndex(newIndex)
                                }}
                                onDragged={() => setIsSwiping(false)}
                            >
                                {rooms.map((room, i) => (
                                    <RoomSlide
                                        key={room.id}
                                        id={room.id}
                                        src={room.src}
                                        name={room.name}
                                        isSwiping={isSwiping}
                                        isActive={i === index}
                                        onSelect={() => {
                                            jumpTo(i)
                                        }}
                                    />
                                ))}
                                <AddRoomSlide onAdd={onAddRoom} />
                            </Splide>
                        </div>

                        {active && (
                            <RoomInfo
                                active={active}
                                isSwiping={isSwiping}
                                onFavorite={onFavorite}
                                onDuplicate={onDuplicate}
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SwiperModal
