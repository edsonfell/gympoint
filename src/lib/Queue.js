import Bee from 'bee-queue';
import EnrollMail from '../app/jobs/EnrollMail';
import HelpOrderAnswerMail from '../app/jobs/HelpOrderAnswerMail';
import redisConfig from '../config/redis';

const jobs = [EnrollMail, HelpOrderAnswerMail];

class Queue {
  // Creating a queue for each kind of background job
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    // Destructoring each element of the Jobs
    jobs.forEach(({ key, handle }) => {
      // Below we are storing the queue that keeps our Redis connection
      // and send the handle that's responsible to process the actual
      // backgroung job
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Function to add jobs in the queue;
  // queue: queue where the job will be stored
  // job: the job we wanna put inside the execution queue
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      // 'bee'is the queue
      const { bee, handle } = this.queues[job.key];
      // bee.on('failed') listen to any fail while executing the handle
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}
export default new Queue();
