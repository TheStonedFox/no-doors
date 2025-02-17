import React from 'react'

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle'
// import 'swiper/css/pagination';

import styles from './Slider.module.css'

export default function Slider() {
    return (
        <Swiper
            modules={[Pagination]}
            className={styles.swiper}
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true, el: `.${styles.pagination}` }}
        >
            <SwiperSlide className={styles.slide}>Slide 1</SwiperSlide>
            <SwiperSlide className={styles.slide}>Slide 2</SwiperSlide>
            <SwiperSlide className={styles.slide}>Slide 3</SwiperSlide>
            <SwiperSlide className={styles.slide}>Slide 4</SwiperSlide>

            <div className={styles.pagination}></div>
        </Swiper>
    )
}
