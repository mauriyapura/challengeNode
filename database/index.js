
const ExpressServer = require("../models/server");
const config = require("../config/index");
const sequelize = require("./connection");

const startServer = async ()=> {
    try {

        await sequelize.authenticate();    
        //sequelize.sync({ alter: true }); 
        sequelize.sync();   
        console.log("DB loaded and connected");     
    
        const server = new ExpressServer();
        console.log("Express loaded");
  
        server.start();
        console.log(`      ###########################
      Server listening on port: ${config.port}
      ###########################
        `);   

    } catch (error) {
        console.error("Unable to connect to database: ", error);        
    }
};

module.exports = startServer;
