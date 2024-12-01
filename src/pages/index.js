import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import {ProjectList} from "@/components/ProjectList";
import {AddProject} from"@/components/AddProject";

const inter = Inter({ subsets: ["latin"] });

import prisma from "@/util/prisma";

// GetStaticProps関数を実装して、ページの初期データを取得
export const getStaticProps = async () => {
  const projects = await prisma.project.findMany();
  // console.log("projects in index.js: ", projects);
  // Date型をStringに変換
  const projectsWithoutDates = projects.map(project => ({
    ...project,
    deadline: project.deadline.toISOString(), // Date型をISO 8601文字列に変換
  }));

  return {
    props: {
      projects: projectsWithoutDates,
    },
    // revalidate: 10, // オプション：データの再取得間隔（秒）
  };
};

export default function Home(props) {

  const [projects, setProjects] = useState(props.projects);
  return (
    <main
      className={`flex min-h-screen flex-col items-center  m-24 ${inter.className}`}
    >
      <ProjectList projects={projects}></ProjectList>
      <AddProject/>

    </main>
  );
}
