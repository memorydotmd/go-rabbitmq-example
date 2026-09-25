# go-rabbitmq-example

Implement a task scheduler using RabbitMQ.

- RabbitMQ Instance: [CloudAMQP Console](https://api.cloudamqp.com/console/68d88238-d435-41f2-8f44-e69aad890595/details)
- Postgres Instance: [Neon Console](https://console.neon.tech/app/projects/royal-fog-31827183/branches/br-sparkling-glitter-b3g2xkxg?database=neondb)

## Quick Start

Run the worker

```sh
cd ./worker

npm ci
cp .env.example .env
# Configure RabbitMQ and S3 in .env
npm start
```

Run the scheduler

```sh
cd ./scheduler
go mod download
go run ./cmd/
```

Open web UI at `localhost:7031`

## Example Result

Human eyes are much more sensitive to brightness detail than color detail, so the model only upscales the brightness channel; color is upscaled with plain (bicubic) resizing. One channel (Y) instead of three (Y, Cb, Cr) makes the model small and fast.

![demo](./demo.png)
