import Banner from './ui/landing-page/banner'
import Brands from './ui/landing-page/brands'
import NewsList from './ui/landing-page/news-list'
import MirrorOfSuccessList from './ui/landing-page/mos-list'
import Explore from './ui/landing-page/explore'
import Navbar from './ui/landing-page/navbar'
import Footer from './ui/landing-page/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="">
        <section>
          <Banner />
        </section>
        <section>
          <Brands />
        </section>
        <section>
          <NewsList />
        </section>
        <section>
          <MirrorOfSuccessList />
        </section>
        <section>
          <Explore />
        </section>
      </main>
      <Footer />
    </>
  )
}
