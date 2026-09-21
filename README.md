# Image Upscaler

Learn to implement a task scheduler using RabbitMQ.

- RabbitMQ Instance: [CloudAMQP Console](https://api.cloudamqp.com/console/68d88238-d435-41f2-8f44-e69aad890595/details)
- Postgres Instance: [Neon Console](https://console.neon.tech/app/projects/royal-fog-31827183/branches/br-sparkling-glitter-b3g2xkxg?database=neondb)

## Quick Start

Run the worker

```sh

```

Run the scheduler

```sh

```

Open web UI at `localhost:7031`

## Example Result

Human eyes are much more sensitive to brightness detail than color detail, so the model only upscales the brightness channel; color is upscaled with plain (bicubic) resizing. One channel (Y) instead of three (Y, Cb, Cr) makes the model small and fast.

![demo](./demo.png)

## RabbitMQ vs. Kafka

RabbitMQ is a traditional message broker (smart router) with granular per-message control: ack, nack, requeue, dead-letter, TTL, priority. It pushes messages to consumers and deletes them once acknowledged.

Kafka is a distributed event **streaming platform** (dumb broker). Useful when needing replayable event history, ordering per partition, or multiple independent consumer groups reading the same events.

- Append-only log, messages aren't deleted on consumption (replay is free)
- Consumers pull from at their own offset.
- No per-message ack/retry/DLQ/priority/delay.
