const AfipSDK = require('@afipsdk/afip.js');
const { config } = require('../config');

const CERTIFICATE = "./certificate.pem";
const CERTIFICATE_KEY = "./private.key";
// const URLWSAAWSDL = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL";

const afipsdk = new AfipSDK({
    CUIT: config.cuitAfip,
    cert: CERTIFICATE,
    key: CERTIFICATE_KEY,
    res_folder: './certificates',
    ta_folder: './certificates'
})

class AfipServices {

    async getPersonAFIP(cuit) {
        // const serverStatus = await afipsdk.RegisterScopeThirteen.getServerStatus();
        // console.log("serverStatus", serverStatus);
        const response = await afipsdk.RegisterScopeThirteen.getTaxpayerDetails(parseInt(cuit));
        console.log("getPersonAFIP", response);
        return response || {};
    }
}

module.exports = AfipServices;