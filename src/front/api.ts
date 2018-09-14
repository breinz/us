import Axios from "axios";

/**
 * Post a request to the api
 * @param url The api url
 * @param params Params to send
 */
export default async function post(url: string, params: any = null) {
    let res;
    try {
        res = await Axios.post(url, params);
    } catch (err) {
        return { fatal: err };
    }

    return res.data;
}