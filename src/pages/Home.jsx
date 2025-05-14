import React from 'react'
import Header from '../components/header'
import SpecialityMenu from '../components/SpecialityMenu'
import BonDocs from '../components/BonDocs'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialityMenu/>
      <BonDocs/>
      <Banner/>
    </div>
  )
}

export default Home
