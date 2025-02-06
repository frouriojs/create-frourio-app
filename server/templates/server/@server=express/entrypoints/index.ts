import { init } from 'service/app';
import { API_SERVER_PORT } from 'service/envValues';

init().listen(API_SERVER_PORT);
