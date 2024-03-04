import axios from "axios";
import config from "../config/config";
import { CONTACT, PURCHASES } from "../constants/backend.constants";

type ListContactApi = {
  query?: Record<string, any>;
};

const listContacts = (args?: ListContactApi) => {
  let url = config.BACKEND_BASE + PURCHASES.LIST + CONTACT.LIST;

  // let url =
  //   "https://inventory-api-sandbox.sumtracker.com/purchases/contacts/?limit=25&offset=125";

  let query = args?.query || {};
  return axios.get(url, {
    params: query,
  });
};

export { listContacts };
