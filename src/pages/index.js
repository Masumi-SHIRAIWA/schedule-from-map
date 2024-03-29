import Image from "next/image";
import { Inter } from "next/font/google";

import {ProjectList} from "@/components/ProjectList"

const inter = Inter({ subsets: ["latin"] });

import prisma from "@/util/prisma";
// GetStaticProps関数を実装して、ページの初期データを取得
export const getStaticProps = async () => {
  const projects = await prisma.projects.findMany();
  // console.log("projects in index.js: ", projects);
  return {
    props: {
      projects,
    },
    // revalidate: 10, // オプション：データの再取得間隔（秒）
  };
};

export default function Home(props) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ProjectList projects={props.projects}></ProjectList>
    </main>
  );
}
