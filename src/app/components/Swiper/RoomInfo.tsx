'use client'

import { Copy, Heart, HeartStraight, ShareNetwork } from '@phosphor-icons/react'
import '@splidejs/react-splide/css'
import { motion } from 'framer-motion'
import { Room } from '../../types/room'

type RoomInfoProps = {
    active: Room
    isSwiping: boolean
    onFavorite: (roomId: string) => void
    onDuplicate: (roomId: string) => void
}

const RoomInfo = ({
    active,
    isSwiping,
    onFavorite,
    onDuplicate,
}: RoomInfoProps) => (
    <motion.div
        className="room-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, filter: isSwiping ? 'blur(5px)' : 'blur(0px)' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
        <div className="room-info-wrapper">
            <div>
                <h3>{active.name.toUpperCase()}</h3>
                <p>
                    Floor - {active.floor}{' '}
                    <span style={{ marginLeft: '20px' }}>
                        Wall - {active.wall}
                    </span>
                </p>
            </div>
            <div className="actions">
                <button>
                    <ShareNetwork size={18} /> Share
                </button>
                <button
                    style={{
                        backgroundColor: active.isFavorite
                            ? '#ff000087'
                            : 'revert-layer',
                    }}
                    onClick={() => onFavorite(active.id)}
                >
                    {active.isFavorite ? (
                        <Heart
                            size={18}
                            weight="fill"
                            style={{ color: 'red' }}
                        />
                    ) : (
                        <HeartStraight size={18} />
                    )}{' '}
                    Favorite
                </button>
                <button onClick={() => onDuplicate(active.id)}>
                    <Copy size={18} /> Duplicate
                </button>
            </div>
        </div>
    </motion.div>
)

export default RoomInfo
