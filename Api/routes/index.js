const routerChamados = require("./routerTickets");
const routerUser = require("./routerRegister");
const routerTicketComentarios = require("./routerComentarios");
const routerLogin = require("./routerLogin");

module.exports = (app) =>{ 
    app.use(routerChamados);
    app.use(routerUser);
    app.use(routerTicketComentarios);
    app.use(routerLogin);
}