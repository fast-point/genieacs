import ava from "ava";

ava("no environment variable, should return undefined", async(t) => {
    delete require.cache[require.resolve('../lib/kafka')];
    const { publishTask } = require("../lib/kafka")
    const response = await publishTask({})
    t.is(response, undefined)
})


ava("all environment variable, should return undefined", async(t) => {
    delete require.cache[require.resolve('../lib/kafka')];

    process.env.TOPIC_NAME = 'tr069_tasks';
    process.env.CLIENT_ID = 'publishTasks';
    process.env.KAFKA_BROKERS = "url1,url2";
    

    const { publishTask } = require("../lib/kafka")
    const response = await publishTask({})
    t.not(response, undefined)

    t.not(response.kafkaValidStatus, undefined)
    t.not(response.reskafkaValidResult, undefined)
})