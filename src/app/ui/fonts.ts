import {
  Inter,
  KoHo,
  Manrope,
  Nunito,
  Open_Sans,
  Plus_Jakarta_Sans,
  Poppins,
  Roboto,
} from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })
export const koho = KoHo({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
})
export const manrope = Manrope({ subsets: ['latin'] })
export const nunito = Nunito({ subsets: ['latin'] })
export const openSans = Open_Sans({ subsets: ['latin'] })
export const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })
export const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
export const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
})
