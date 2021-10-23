import axios from "../network/index";
const URL = "http://localhost:3000";
export const getImage = async (reqbody) => {
  try {
    const apiUrl = `${URL}/api/v1/images/resize/stat`;
    const res = await axios.post(apiUrl, reqbody);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const deleteImage = async (reqbody) => {
  try {
    const apiUrl = `${URL}/api/v1/images/delete`;
    const res = await axios.post(apiUrl, reqbody);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
export async function uploadImageCore(file, resolutions) {
  const form = new FormData();
  form.append("files", file, file.name);
  form.append("public", "yes");
  form.append("resolutions", JSON.stringify(resolutions));
  try {
    const apiUrl = `${URL}/api/v1/images/`;
    const res = await axios.post(apiUrl, form);

    if (res.status == 200) {
      return Promise.resolve(res);
    } else {
      return Promise.reject();
    }
  } catch (error) {
    return Promise.reject(error.response.data);
  }
}
