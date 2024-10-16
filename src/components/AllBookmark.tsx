import React, { useEffect, useState } from "react";
export interface IBookMark {
  _id: string;
  title: string;
  link: string;
  tag: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  topics?: string;
  // _v: number;
}
function AllBookmark() {
  const [bookmark, setBookmark] = useState<IBookMark[]>([]);
  useEffect(() => {
    async function fetchData() {
      const req = await fetch("http://localhost:3008/api/get-all-bookmark", {
        credentials: "include",
      });
      const data = await req.json();
      console.log(data);
      setBookmark(data.data as IBookMark[]);
    }
    fetchData();
  }, []);
  return <div></div>;
}

export default AllBookmark;
