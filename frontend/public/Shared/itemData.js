
"use client";

import { useEffect, useState } from 'react';
;
import FirstImg from '../images/firstimg.webp'
import SecondImg from '../images/secondimg.webp'
import ThirdImg from '../images/thirdimg.webp'
import FourthImg from '../images/fourthimg.webp'
import FifthImg from '../images/fiftimg.webp'
import LogoPng from '../images/logonew.png'


const images = [
  { image: FirstImg, alt: 'A delicious, juicy burger' },
  { image: ThirdImg, alt: 'A delicious, spicy curry' },
  { image: SecondImg, alt: 'Steamed dumplings' },
  { image: FourthImg, alt: 'Mac and cheese' },
  { image: FifthImg, alt: 'A delicious pizza' },

];

export default images;
export {LogoPng}

// export default LogoPng;
