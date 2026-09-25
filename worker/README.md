# Node.js image worker

Consumes RabbitMQ tasks, downloads images from S3/MinIO, upscales them with FSRCNN, and uploads PNG results. Runtime and repository tooling are JavaScript; no Python or CUDA installation is needed.

## Run

Requires Node.js 22.9 or newer and npm. Tested on Node.js 26.8.2, macOS ARM64. The native `sharp` and `onnxruntime-node` packages supply binaries for supported platforms; use a platform supported by both projects.

```sh
cd worker
npm ci
cp .env.example .env
# Set your RabbitMQ and S3 connection details in .env.
npm start
```

The worker loads `.env` without overriding existing environment variables. See `.env.example` for defaults. `FAKE_DELAY` is a nonnegative number of seconds (default 5, use 0 for real processing timings). `UPSCALE_SCALE` must be 2, 3, or 4 and defaults to 3. All three bundled models load at startup. A missing or unsupported task scale uses the default model.

MinIO uses path-style S3 requests and region `us-east-1`. A missing bucket is created on startup; permission and connection errors fail startup.

## Standalone image processing

```sh
npm run upscale -- assets/images/original.jpg assets/images/upscaled_x4.png --scale 4
# Optional: --weights path/to/model.onnx (or WEIGHTS_PATH for this CLI only)
npm run try-upscale
```

Output is always PNG, regardless of the output filename. Alpha is discarded and grayscale inputs are expanded to RGB. The network upscales the luminance channel; chroma uses bicubic interpolation. Small pixel differences from the former OpenCV implementation are expected.

## Queue contract

Input queue `upscale.tasks`:

```json
{
  "task_id": "abc123",
  "input_key": "uploads/photo.png",
  "output_key": "results/photo.png",
  "scale": 3
}
```

Results queue `upscale.results`:

```json
{ "task_id": "abc123", "status": "processing" }
```

Statuses are `processing`, `done`, and `failed`. Tasks without an ID emit no status. Both queues are durable; prefetch is one, heartbeat is 600 seconds, and reconnect delay is five seconds. Malformed JSON/non-object messages are rejected without requeue. Processing failures emit `failed` and reject without requeue. Terminal status publication is confirmed before acknowledging/rejecting the task. A broker disconnect can cause redelivery and duplicate statuses; output writes use the same key. SIGINT/SIGTERM cancel consumption, finish the current task, and close resources.

## Models and dependencies

- `amqplib`: RabbitMQ AMQP 0-9-1 client.
- `@aws-sdk/client-s3`: S3/MinIO storage.
- `sharp`: image decoding, chroma resizing, and PNG encoding.
- `onnxruntime-node`: CPU FSRCNN inference, one inference thread per model session.

Models originate from https://github.com/yjn870/FSRCNN-pytorch and were converted from this repository's original weights to ONNX opset 17. Each model accepts float32 `[1, 1, height, width]` normalized luminance and returns `[1, 1, height * scale, width * scale]`. Height and width are dynamic. `assets/weights/provenance.json` records source and exported SHA-256 checksums and conversion versions. Python conversion tooling is intentionally not retained.

## Project layout

```text
src/
  index.js       # Startup, task processing, and shutdown
  config.js      # Environment settings
  consumer.js    # RabbitMQ consumption and status updates
  storage.js     # S3 download and upload functions
  upscaler.js    # Load ONNX models and upscale images
  cli.js         # Standalone image command
assets/
  images/        # Sample images
  weights/       # ONNX models and provenance
```

Plain ES modules and functions, with direct calls to the package APIs. No classes or test-only dependency injection.

```sh
npm run try-upscale
npm run format
npm run format:check
```

The worker test suite and reference fixtures have been removed. For a live check, run the worker with RabbitMQ and MinIO, submit each scale through the scheduler, and verify status updates and downloadable PNG output.
