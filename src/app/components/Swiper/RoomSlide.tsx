'use client'

import { SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

type RoomSlideProps = {
    id: string
    src: string
    name: string
    isSwiping: boolean
}

const RoomSlide = ({ id, src, name, isSwiping }: RoomSlideProps) => (
    <SplideSlide key={id}>
        <div className={`slide-frame ${isSwiping ? 'blurring' : ''}`}>
            <img src={src} alt={name} className="slide-img" />
        </div>
    </SplideSlide>
)

export default RoomSlide
