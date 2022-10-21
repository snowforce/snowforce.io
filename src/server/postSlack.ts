/**
 * https://developer.salesforce.com/docs/platform/lwr/guide/lwr-routing-server.html#overridden-page-response-example
 *
 * !!!! This is not great... and really just a work around...!!!
 *
 * Really this should be routed through an endpoint more intentionally built for this type proxy work
 *
 * When the official docs come out to showcase how to do this it will be refactored
 */

import { ViewRequest, ViewResponse } from "lwr";
import axios from "axios";
import jsforce from "jsforce";

import * as dotenv from "dotenv";
dotenv.config();

const fieldsByForm = {
  Volunteer: [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
    { name: "city", label: "City" },
    { name: "details", label: "What would you like to help with?" },
  ],
  Speaker: [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "position", label: "Title" },
    { name: "company", label: "Company" },
    { name: "headline", label: "Session Title" },
    { name: "audience", label: "Audience" },
    { name: "audienceLevel", label: "Audience Level" },
    { name: "format", label: "Format" },
    { name: "abstract", label: "Session Abstract" },
    { name: "bio", label: "Please Share A Little About You" }
  ],
  Sponsor: [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "position", label: "Title" },
    { name: "company", label: "Company" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
    { name: "goals", label: "How can we help this be a success?" },
  ],
};

const cleanText = (str = '') => {
  return (str?.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;') ?? '').slice(0, 1900);
}

const formatter = (formName: string, formData) => {
  let fieldList = (fieldsByForm[formName] ?? []).filter(field => formData[field.name] !== undefined);
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: formName,
      },
    },
    {
      type: "section",
      fields: [
        ...fieldList.filter((field, i) => i < 10).map((field) => {
          return {
            type: "mrkdwn",
            text: `*${field.label}*\n>${cleanText(formData[field.name])}`,
          };
        })
      ],
    }
  ];
};

const postToSalesforce = (formName, formData) => {
  const conn = new jsforce.Connection();
  conn.login(process.env.sfUserName || '', process.env.sfUserPassword || '').then(() => {
    conn.sobject('Web_Lead__c').create({ Landing_Page__c: formName, JSON__c: JSON.stringify(formData) });
  })
}

const slackPostHandler = async (req: ViewRequest): Promise<ViewResponse> => {
  const { param } = req.params;
  const queryParams = req.query;

  let bodyText;
  try {
    bodyText = { Form: param, ...queryParams };
  } catch (err) {
    console.log('Error Creating Body Text', err);

    return {
      status: 500,
      body: { status: "ERROR", message: 'Error Creating Post Text' },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  let bodyBlocks;
  try {
    bodyBlocks = formatter(param, queryParams);
  } catch (err) {
    console.log('Error Creating Body Text', err);
    return {
      status: 500,
      body: { status: "ERROR", message: 'Error Creating Post' },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  postToSalesforce(param, queryParams);

  return axios
    .post("https://hooks.slack.com/services/" + process.env.SLACK_HOOK, {
      text: JSON.stringify(bodyText ?? ''),
      blocks: JSON.stringify(bodyBlocks ?? '')
    })
    .then(() => {
      return {
        status: 200,
        body: { status: "OK", message: `Text: ${JSON.stringify(bodyText ?? '')} Posted: ${JSON.stringify(bodyBlocks ?? '')}` },
        headers: {
          "Content-Type": "application/json",
        },
      };
    })
    .catch((err) => {
      return {
        status: 500,
        body: { status: "ERROR", message: `ERROR while posting form data: ${err}. Text: ${JSON.stringify(bodyText ?? '')} Posted: ${JSON.stringify(bodyBlocks ?? '')}` },
        headers: {
          "Content-Type": "application/json",
        },
      };
    });
};

export default slackPostHandler;
