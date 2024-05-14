'use client'

import { usePathname } from "next/navigation"
import { motion } from 'framer-motion'; 

// css
import '@/sass/components/animation/ScreenTransition.scss';

export const ScreenTransition = ({
  children
} : {
  children: React.ReactNode
}) => {

  // 画面のパスを取得
  const pathName = usePathname();

  const blackBox = {
    initial: {
      height: '100vh',
      bottom: 0,
    },
    animate: {
      height: 0,
      opacity: 1,
      transition: { 
        duration: 1, 
        ease: [0.87, 0, 0.13, 0] 
      }
    }
  }

  return (
    <div className="ScreenTransition">
      <motion.div
      className="motion"
      initial='initial'
      animate='animate'
      variants={blackBox}
      >
        {children}
      </motion.div>
      </div>
  )
}
