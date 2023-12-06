"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Client } from "urql";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { user: string } }) {
  const [results, setResults] = useState([""]);
  const [userLink, setUserLink] = useState("");
  const [fetching, setFetching] = useState(false);
  const fetchResults = async () => {
    if (fetching) return;
    setFetching(true);
    const r = await fetch("/activity/result", {
      method: "POST",
      body: JSON.stringify({
        user: params.user,
      }),
    });
    setFetching(false);
    const resData = await r.json();
    console.log(resData);
    setUserLink(resData.data.user.url);
    setResults(resData.data.user.repositories.nodes.map((x) => x.refs));
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <main className="flex flex-col min-h-screen gap-4 p-24">
      <a
        href={userLink}
        className="my-4 text-4xl font-bold text-center underline hover:text-blue-300"
      >
        {params.user}
      </a>
      <div className="text-2xl underline">Recent commits</div>
      <div className="flex flex-col gap-4 text-white">
        {!fetching &&
          results.map((x, i) => {
            // console.log(x.nodes);
            return (
              <>
                {/* @ts-ignore */}
                {x.nodes?.map((x, i) => {
                  console.log(x);
                  return (
                    <a
                      key={x.target.commitUrl}
                      target={"_blank"}
                      rel="noreferer"
                      className="text-black hover:text-blue-900 visited:text-indigo-950"
                      href={x.target.commitUrl}
                    >
                      {x.target.commitResourcePath}
                      {/* {x.target.committer.user.login} */}
                    </a>
                  );
                })}
              </>
            );
          })}
      </div>
    </main>
  );
}
