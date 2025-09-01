import React from 'react';
// Importe os componentes e os estilos do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Importe os estilos CSS do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Importe as suas imagens de banner (coloque-as na pasta src/assets)
import banner1 from '../assets/banner-combo.png'; // Substitua pelos nomes reais dos seus ficheiros
import banner2 from '../assets/banner-bebidas.png';
import banner3 from '../assets/banner-novidade.png';

const banners = [
  { img: banner1, alt: 'Banner do Combo do Mês' },
  { img: banner2, alt: 'Banner de Oferta de Bebidas' },
  { img: banner3, alt: 'Banner de Novo Hambúrguer' },
];

export default function BannerSwiper() {
  return (
    <div>
      <Swiper
        // Instale os módulos que vamos usar
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className=""
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <img src={banner.img} alt={banner.alt} className="w-full h-[80vh] object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
