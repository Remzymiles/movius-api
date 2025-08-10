import type { ApplicationService } from '@adonisjs/core/types';
import mail from '@adonisjs/mail/services/main';
import redis from '@adonisjs/redis/services/main';
import { Queue, QueueEvents, Worker } from 'bullmq';

export default class EmailQueueProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    const connection = redis.connection().ioConnection.options;

    const emailsQueue = new Queue('emails', { connection });

    mail.setMessenger(mailer => {
      return {
        async queue(mailMessage, config) {
          await emailsQueue.add('send_email', {
            mailMessage,
            config,
            mailerName: mailer.name,
          });
        },
      };
    });

    const worker = new Worker(
      emailsQueue.name,
      async job => {
        if (job.name === 'send_email') {
          const { mailMessage, config, mailerName } = job.data;

          await mail.use(mailerName).sendCompiled(mailMessage, config);
        }
      },
      {
        connection,
      },
    );

    worker.on('completed', job => {
      console.log(`${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
      console.log(`${job?.id} has failed with ${err.message}`);
    });

    const queueEvents = new QueueEvents('emails', { connection });

    queueEvents.on('waiting', ({ jobId }) => {
      console.log(`A job with ID ${jobId} is waiting`);
    });

    queueEvents.on('active', ({ jobId, prev }) => {
      console.log(`Job ${jobId} is now active; previous status was ${prev}`);
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
      console.log(`${jobId} has completed and returned ${returnvalue}`);
    });

    queueEvents.on('failed', ({ jobId, failedReason }) => {
      console.log(`${jobId} has failed with reason ${failedReason}`);
    });
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
