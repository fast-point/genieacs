"use strict"
import * as logger from "../lib/logger";
import { Kafka } from "kafkajs"

let isKafkaConfigured = false
let brokers = []

// Get environment variables
let topicName = process.env.TOPIC_NAME
let clientId = process.env.CLIENT_ID
const brokersEnvironmentValue = process.env.KAFKA_BROKERS

if(brokersEnvironmentValue && topicName && clientId){
    brokers = brokersEnvironmentValue.split(",")
    //TODO: check urls and ports between 0-65536
    isKafkaConfigured = true
}

const kafka = new Kafka({
    clientId: clientId,
    brokers: brokers,
})

const producer = kafka.producer()

export const publishTask = async (payload: object) => {
    if(!isKafkaConfigured){
        return undefined
    }

    const { kafkaProducerStatus, kafkaProducerResult } = await run(
        topicName,
        payload
    )

    return {
        kafkaValidStatus: kafkaProducerStatus,
        kafkaValidResult: kafkaProducerResult,
    }
}

const run = async (topic: string, payload: object) => {
    // Producing
    try {
        const kafkaPayload = [
            {
                key: null,
                value: JSON.stringify(payload)
            }
        ]
        await producer.connect()
        const res = await producer.send({
            topic: topic,
            messages: kafkaPayload,
        })
        return {
            kafkaProducerStatus: true,
            kafkaProducerResult: res,
        }
    } catch (error) {
        logger.error(error)
        return {
            kafkaProducerStatus: false,
            kafkaProducerResult: error,
        }
    }
}