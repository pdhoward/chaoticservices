# microservices

A library of microservices targeted to aws lamda, next and openwhisk

These services demonstrate the capabilities of the Strategic Machines platform in orchestrating a suite of microservices to support rich Brand interaction.

The pattern represented by this platform is Asynchronous Command Call, where the atomic calls of each microservice needs to be rigorously managed with a delivery guarantee

api documentation notes

Note each microservice is purpose built, representing a skill that an agent executes in some sequence

The sequence cannot be anticipated, although all information visible on the platform is made available to the microservice function

However, only the response object sent by the platform will be recorded and made available to the same or next microservice executed in within a dialogue

1. each service is rigidly structured (highly opinionated) on the format of the data object received and sent
2. 
