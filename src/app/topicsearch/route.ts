import { Client, gql, cacheExchange, fetchExchange } from "urql";
export async function POST(req: Request) {
  const client = new Client({
    url: process.env.DATA_URL ?? "",
    fetchOptions: {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.DATA_API_KEY,
      },
    },
    exchanges: [cacheExchange, fetchExchange],
  });

  const data = await client.query(
    gql`
      query ($topic: String!) {
        search(query: $topic, type: REPOSITORY, first: 10) {
          edges {
            node {
              ... on Repository {
                nameWithOwner
                description
                url
                owner {
                  login
                }
              }
            }
          }
        }
      }
    `,
    { topic: "mina-navigators" }
  );
  console.log(data);
  if (data.error) console.log(data.error);

  return Response.json({ data: data.data });
}
