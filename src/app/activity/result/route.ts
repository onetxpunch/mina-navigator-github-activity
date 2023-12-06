import { Client, gql, cacheExchange, fetchExchange } from "urql";

export async function POST(req: Request) {
  const { user } = await req.json();
  console.log(user);
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
      query ($login: String!) {
        user(login: $login) {
          url
          repositories(last: 15) {
            totalCount
            nodes {
              pushedAt
              repositoryTopics(first: 2) {
                nodes {
                  topic {
                    name
                  }
                  url
                }
              }
              refs(last: 15, refPrefix: "refs/") {
                nodes {
                  target {
                    commitUrl
                    commitResourcePath
                  }
                }
              }
            }
          }
        }
      }
    `,
    { login: user }
  );

  return Response.json({ data: data.data });
}
