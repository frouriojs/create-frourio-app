import { init } from "$/service/app";
import {
  API_SERVER_PORT,
} from '$/service/envValues'

const app = init();
app.listen(API_SERVER_PORT)
