import Head from "next/head";
import React from "react";
import InputImage from "../components/InputImage/InputImage";
import Layout from '../components/layout';
function HomePage() {   
    return (
        <Layout>
            <Head>
                <title>Home</title>
            </Head>
            <div className="home">
                <InputImage labelId="image" placeholderText="請選擇圖片" />
            </div>
        </Layout>
    )
}

export default HomePage