import {GetServerSidePropsContext, GetServerSidePropsResult, NextPage} from "next";
import React from "react";
import dynamic from 'next/dynamic'

const DynamicComponentMainPage = dynamic(
  () => import('../components/MainPage/MainPage'),
  { ssr: false }
)

const Home: NextPage = () => {

  return (
    <React.Fragment>
      <DynamicComponentMainPage />
    </React.Fragment>
  )
}
export default Home;
