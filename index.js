'use strict';

//import ask-sdk-core
const Alexa = require('ask-sdk-core');

//skill name
const appName = 'My Calculator';

//code for the handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        //welcome message
        let speechText = 'Welcome to my calculator you can add, subtract';
        //welcome screen message
        let displayText = "Welcome to my calculator you can add, subtract'"
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, displayText)
            .getResponse();
    }
};

//implement custom handlers
const AddIntentHandeler = {
  canHandel(handelerInput) {
    return handelerInput.requestEnvelope.request.type == 'IntentRequest'
    && handelerInput.requestEnvelope.request.intent.name == 'AddIntent'
  },
  handel(handelerInput) {
    let speechText = '';
    let displayText = '';
    let intent = handelerInput.requestEnvelope.request.intent;
    let firstNumber = intent.slots.firstNumber.value;
    let secondNumber = intent.slots.secondNumber.value;

    if ( firstNumber && secondNumber) {
      //Preform operation
      let result = parseInt(firstNumber) + parseInt(secondNumber);
      speechText = `The result of ${firstNumber} plus ${secondNumber} is ${result}`;
      displayText = `${result}`;

      return handelerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(appName, displayText)
      .withShouldEndSession(true)
      .getResponse();


    } else {
      //Ask for the requierd input
      return handelerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse();

    }

  }
};

const SubtractIntentHandeler = {
  canHandel(handelerInput) {
    return handelerInput.requestEnvelope.request.type == 'IntentRequest'
    && handelerInput.requestEnvelope.request.intent.name == 'SubtractIntent'
  },
  handel(handelerInput) {
    let speechText = '';
    let displayText = '';
    let intent = handelerInput.requestEnvelope.request.intent;
    let firstNumber = intent.slots.firstNumber.value;
    let secondNumber = intent.slots.secondNumber.value;

    if ( firstNumber && secondNumber) {
      //Preform operation
      let result = parseInt(secondNumber) - parseInt(firstNumber);
      speechText = `The result of ${secondNumber} minus ${firstNumber} is ${result}`;
      displayText = `${result}`;

      return handelerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(appName, displayText)
      .withShouldEndSession(true)
      .getResponse();


    } else {
      //Ask for the requierd input
      return handelerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse();

    }

  }
};


//end Custom handlers

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        //help text for your skill
        let speechText = 'You can add or subtract integers';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        let speechText = 'Goodbye';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

//Lambda handler function
//Remember to add custom request handlers here
let skill;
exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        AddIntentHandeler,SubtractIntentHandeler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};
