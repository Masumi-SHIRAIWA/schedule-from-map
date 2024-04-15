import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import {ProjectList} from "@/components/ProjectList"

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
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");

  const addProject = () => {
        
  }


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="flex justify-center">
          <input
            type="text"
            onChange={(e) => setProjectName(e.target.value)}
            name="title"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <input
            type="date"
            onChange={(e) => setDeadline(e.target.value)}
            name="deadline"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />

          <button
          type="button"
          onClick={addProject}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
          Add project
          </button>
      </div>
      <ProjectList projects={props.projects}></ProjectList>
    </main>
  );
}
