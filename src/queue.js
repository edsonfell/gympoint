// This file is responsible for executing our queues separated
// from our main application
// To execute this, there is a new command shortcut in package.json
import 'dotenv/config';
import Queue from './lib/Queue';

Queue.processQueue();
