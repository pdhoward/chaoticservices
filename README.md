# microservices

A library of microservices targeted to aws lamda, next and openwhisk

These services demonstrate the capabilities of the Strategic Machines platform in orchestrating a suite of microservices to support rich Brand interaction.

The pattern represented by this platform is Asynchronous Command Call, where the atomic calls of each microservice needs to be rigorously managed with a delivery guarantee

# Building microservices for Strategic Machines
api documentation notes

Note each microservice is purpose built, representing a skill that an agent executes in some sequence

The sequence cannot be anticipated, although all information visible on the platform is made available to the microservice function

However, only the response object sent by the platform will be recorded and made available to the same or next microservice executed in within a dialogue

1. each service is rigidly structured (highly opinionated) on the format of the data object received and sent
2. a response object is an array of objects. Each object within the array is a single key value pair
3. a key of link -- will assume the link is a valid url and pass it accordingly on the web
4. a key of image -- will text the image using mms

# Building State Machines
1. a state machine is a JSON object, with each property representing a simple function
2. a state machine can have as many states as needed
3. all state machine sequences have to terminate with the state of END  -- this signals to the platform that the final state has been reached and to terminate the active dialogue

# Deploying microservices

1. implement serviceless framework
2. sls deploy
