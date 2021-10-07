import { authorize } from "@liveblocks/node";
import { Handler } from "@netlify/functions";
import console from "console";

require("dotenv").config();

const testApiKey =
  process.env.LIVEBLOCKS_TEST_API_KEY ?? "sk_test_PEqKTcHDheSNsDZpqC7mCDUs";
const liveApiKey = process.env.LIVEBLOCKS_LIVE_API_KEY;

const handler: Handler = async (event, context) => {
  try {
    const room = event.queryStringParameters["room"];
    const shouldUseTestKey = event.queryStringParameters["test"];
    const apiKey = shouldUseTestKey ? liveApiKey : testApiKey;
    const authResult = await authorize({
      room: room,
      secret: apiKey,
    });

    const parsedBody = JSON.parse(authResult.body);
    if (authResult.status !== 200) {
      return {
        statusCode: authResult.status,
        body: JSON.stringify({ liveblocks: parsedBody }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ liveblocks: parsedBody }),
    };
  } catch (error) {
    console.error(error);
    const stringifiedError = JSON.stringify(
      error,
      Object.getOwnPropertyNames(error)
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: stringifiedError }),
    };
  }
};

export { handler };
