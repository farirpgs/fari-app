import dynamic from "next/dynamic";
import React from "react";

const HomeRoute = dynamic(() => import("../lib/routes/Home/HomeRoute"), {
  ssr: false,
});

function HomePage() {
  return <HomeRoute />;
}

export default HomePage;
