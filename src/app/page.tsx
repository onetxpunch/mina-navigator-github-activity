"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Client } from "urql";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [results, setResults] = useState(["onetxpunch"]);
  const [r2, setR2] = useState([]);
  const [listValue, setListValue] = useState("");
  const [fetching, setFetching] = useState(false);
  const fetchResults = async () => {
    if (fetching) return;
    setFetching(true);
    const r = await fetch("/topicsearch", {
      method: "POST",
    });
    setFetching(false);
    const resData = await r.json();
    setR2(resData.data.search.edges.map((x) => x.node));
    // setResults(await r.json());
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <main className="flex flex-col min-h-screen gap-6 p-24">
      <label className="w-full max-w-xs form-control">
        <div className="label">
          <span className="text-black label-text">Lookup Navigator?</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-xs bg-white input input-bordered"
          value={listValue}
          onInput={(x) => {
            setListValue(x.currentTarget.value);
          }}
          onKeyDown={(x) => {
            if (x.key === "Enter") {
              router.push(`/activity/${listValue}`);
            }
          }}
        />
        <div className="label">
          <span className="text-black label-text-alt">
            Press <code>enter</code> to query
          </span>
        </div>
      </label>
      <div className="text-2xl">Recently Active Navigators</div>
      <div className="flex gap-4 text-white">
        {r2.map((x) => {
          // @ts-ignore
          return (
            <Link
              key={x}
              // @ts-ignore
              href={`/activity/${x.owner.login}`}
              className="text-black hover:text-yellow-900"
            >
              {/* @ts-ignore */}
              {x.owner.login}
            </Link>
          );
        })}
      </div>
      <div className="text-2xl">#mina-navigators Repos</div>
      <div className="flex flex-col gap-3">
        {r2?.map((x, i) => {
          console.log(x);
          // @ts-ignore
          return (
            <a
              key={i}
              // @ts-ignore
              href={x.url}
              className="hover:text-yellow-900 visited:text-orange-950"
            >
              {/* @ts-ignore */}
              <div>{x.nameWithOwner}</div>
              {/* @ts-ignore */}
              <div>{x.description}</div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
