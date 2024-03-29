import Image from "next/image";
import { Inter } from "next/font/google";

import {ProjectList} from "@/components/ProjectList"

const inter = Inter({ subsets: ["latin"] });

// // GetStaticProps関数を実装して、ページの初期データを取得
// export const getStaticProps = async () => {
//   const todos = await prisma.notes.findMany();
//   console.log("todos in index.js: ", todos);
//   return {
//     props: {
//       todos,
//     },
//     revalidate: 1, // オプション：データの再取得間隔（秒）
//   };
// };

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ProjectList></ProjectList>
    </main>
  );
}
