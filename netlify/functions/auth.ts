import { authorize } from "@liveblocks/node";
import { Handler } from "@netlify/functions";

const API_KEY = "sk_test_PEqKTcHDheSNsDZpqC7mCDUs";

const handler: Handler = async (event, context) => {
  try {
    const room = event.queryStringParameters["room"];
    const authResult = await authorize({
      room: room,
      secret: API_KEY,
    });
    if (authResult.status !== 200) {
      return {
        statusCode: authResult.status,
        body: authResult.body,
      };
    }
    return {
      statusCode: 200,
      body: authResult.body,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export { handler };
