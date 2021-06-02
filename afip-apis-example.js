const DEFAULT_CERTIFICATE = "./private/certificate/certificate.crt";
const DEFAULT_CERTIFICATE_KEY = "./private/certificate/private.key";
const DEFAULT_URLWSAAWSDL = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL";

const loginTicket = new LoginTicket();

loginTicket.wsaaLogin(PersonaServiceA13.serviceId, DEFAULT_URLWSAAWSDL, DEFAULT_CERTIFICATE, DEFAULT_CERTIFICATE_KEY)
  .then(ticket => {
    console.log("=== ticket ===");
    console.log(JSON.stringify(ticket));
    const a13 = new PersonaServiceA13(PersonaServiceA13.testWSDL);
    return a13.dummy({})
      .then(r => {
        console.log(`===dummy===\n${JSON.stringify(r)}`);
        return a13.getIdPersonaListByDocumento({
          token: ticket.credentials.token,
          sign: ticket.credentials.sign,
          cuitRepresentada,
          documento
        });
      })
      .then(id => {
        console.log(`===getIdPersonaListByDocumento===\n${JSON.stringify(id)}`);
        return a13.getPersona({
          token: ticket.credentials.token,
          sign: ticket.credentials.sign,
          cuitRepresentada,
          idPersona: id.idPersonaListReturn.idPersona
        });
      })
      .then(p => {
        console.log(`===getPersona===\n${JSON.stringify(p)}`);
        console.log("=== FIN ===");
      });
  })
  .catch(err => {
    console.error(err);
  });