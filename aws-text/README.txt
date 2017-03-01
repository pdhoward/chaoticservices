
Sending users confirmation text messages through a webui

A serverless deployment to AWS

2 ways to send a text

1. send through webui. An http express server is included with this project
2. update an event.json file (ignored here by git) with the phone number sending to

Update the to phone number the event.json file and message to send in the SMS

Then invoke the function with the serverless CLI. Set the --path event.json so the function knows where to send the SMS.

serverless invoke -f sendText --path event.json
