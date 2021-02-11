import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Provider } from "ims-lti";
import * as qs from "querystring";

import { completeLaunch as ezProxy } from "./integrations/ezproxy";

const consumers = JSON.parse(process.env.CONSUMERS);
/*
{
  "Consumer Key": {
    "integration": "EZProxy",
    "secret": "SECRET KEY",
    "config": {...}
  }
}
*/

const integrations = {
  EZProxy: ezProxy,
};

const getIntegration = async function (
  consumerKey: string
): Promise<(context: Context, req: HttpRequest, params: any) => Promise<void>> {
  const consumer = consumers[consumerKey];
  const integration = consumer.integration;
  if (integrations[integration]) {
    return integrations[integration](consumer.config);
  } else {
    throw new Error("No such integration configured");
  }
};

const getSecret = async function (consumerKey: string): Promise<string> {
  const consumer = consumers[consumerKey];
  if (consumer) {
    return consumer.secret;
  } else {
    throw new Error("Unknown LTI Consumer");
  }
};

const buildRequest = (req: HttpRequest, params: any) => {
  const url = process.env.LTI_LAUNCH_URL || req.url;
  const urlObject = new URL(url);
  const host = urlObject.host;

  return {
    url,
    raw: req.rawBody,
    body: params,
    method: req.method,
    headers: {
      host,
    },
    connection: {
      encrypted: urlObject.protocol === "https:",
    },
  };
};

const launch = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const params = qs.parse(req.rawBody);
  const consumerKey = params.oauth_consumer_key;
  if (!consumerKey || typeof consumerKey !== "string") {
    context.res = {
      status: 422,
      body: `Consumer key is required`,
    };
    context.done();
    return;
  }

  const secret = await getSecret(consumerKey);

  const provider = new Provider(consumerKey, secret);
  const requestObj = buildRequest(req, params);
  const isValid = await new Promise((resolve) => {
    provider.valid_request(requestObj, (err: Error, isValid: boolean) => {
      if (err || !isValid) {
        console.error(err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

  if (!isValid) {
    throw new Error("Unable to authenticate");
  } else {
    const completeLaunch = await getIntegration(consumerKey);
    await completeLaunch(context, req, params);
  }
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (req.method != "POST") {
    context.res = {
      status: 405,
      body: "POST request required to launch",
    };
  } else {
    try {
      await launch(context, req);
    } catch (error) {
      context.res = {
        status: 403,
        body: error.message,
      };
      context.done();
    }
  }
};

export default httpTrigger;
