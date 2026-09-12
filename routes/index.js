const routerChamados = require("./routerTickets");
const routerUser = require("./routerUser");
const routerTicketComentarios = require("./routerComentarios");

module.exports = (app) =>{ 
    app.use(routerChamados);
    app.use(routerUser);
    app.use(routerTicketComentarios);
}