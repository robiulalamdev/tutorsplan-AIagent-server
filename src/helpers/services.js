const { default: axios } = require("axios");
const VARIABLES = require("../config");

const getLocation = async (ip) => {
  let clientIp = ip;

  if (
    VARIABLES.NODE_ENV === "development" &&
    (clientIp === "::1" || clientIp === "127.0.0.1")
  ) {
    clientIp = "1.1.1.1";
  }
  try {
    const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const location = response.data;
    if (location.status === "fail") {
      return {
        country: "",
        countryCode: "",
        zip: "",
        flag: "",
      };
    } else {
      const flag = `src/assets/icons/flags/${location?.countryCode}.png`;
      return {
        country: location?.country,
        countryCode: location?.countryCode,
        zip: location?.zip,
        flag: flag,
      };
    }
  } catch (error) {
    return {
      country: "",
      countryCode: "",
      zip: "",
    };
  }
};

module.exports = {
  getLocation,
};
