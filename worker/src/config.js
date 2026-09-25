export function readConfig(env = process.env) {
  const scale = Number(env.UPSCALE_SCALE ?? 3);
  const delay = Number(env.FAKE_DELAY ?? 5);
  if (![2, 3, 4].includes(scale)) throw new Error('UPSCALE_SCALE must be 2, 3, or 4');
  if (!Number.isFinite(delay) || delay < 0)
    throw new Error('FAKE_DELAY must be a nonnegative number');
  return {
    scale,
    delay,
    url: env.RABBITMQ_URL ?? 'amqp://rabbitmq:password@localhost:5672/',
    queue: env.TASK_QUEUE ?? 'upscale.tasks',
    resultsQueue: env.RESULTS_QUEUE ?? 'upscale.results',
    endpoint: env.S3_ENDPOINT ?? 'http://localhost:9000',
    accessKey: env.S3_ACCESS_KEY ?? 'minio',
    secretKey: env.S3_SECRET_KEY ?? 'password',
    bucket: env.S3_BUCKET ?? 'images',
  };
}
