
const chai = require("chai");
const chaiHttp = require("chai-http");
const { before, after } = require("mocha");


// Assertion Style
chai.should();
chai.use(chaiHttp);

let defaultUser = {
    email: "admin123@gmail.com",
    password: "12345"
};  
let token;
let user;
let character;


// GET all characters
describe("GET all characters", (done)=>{    

    it("It should get all characters", (done)=>{

        chai.request("http://localhost:3000")
            .get("/api/characters")
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('array');
            done();
            })
    });

    it("It should get all characters filtered by name ", (done)=>{

        chai.request("http://localhost:3000")
            .get("/api/characters?nombre=scott")
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('array');
            done();
            })
    });

    it("It should NOT get all characters - Wrong URL", (done)=>{

        chai.request("http://localhost:3000")
            .get("/api/charactersXD")
            .end((err, res)=>{
                res.should.have.status(404);                
            done();
            })
    });

});

// GET Characters by ID
describe("GET character by ID", (done)=>{

    it("It should get character with ID 3", (done)=>{

        chai.request("http://localhost:3000")
            .get("/api/characters/3")
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.have.property('id').eq(3);
            done();
            })
    });

    it("It should NOT get character with wrong ID", (done)=>{

        chai.request("http://localhost:3000")
            .get("/api/characters/2022")
            .end((err, res)=>{
                res.should.have.status(404);
                res.text.should.be.eq('"Character ID not found"');
            done();
            })
    });

});

// POST Character
describe("Rutas que requieren token", (done)=>{

    before(done => {        
        chai
          .request("http://localhost:3000/auth")
          .post("/register")
          .send(defaultUser)
          .end((err, res) => {        
            res.should.have.status(201);
            done();
          });
    });
    before(done => {        
        chai
          .request("http://localhost:3000/auth")
          .post("/login")
          .send(defaultUser)
          .end((err, res) => {
            token = res.body.token;
            user = res.body.user.id;
            res.should.have.status(200);
            done();
          });
    });    
    
    after(done => {          
        chai.request("http://localhost:3000")
           .delete(`/api/characters/${character}`)   
           .set({ token: `${token}` })
           .end((err, res)=>{
                res.should.have.status(200);                
           done();
           })
    });
    after(done => {            
        chai
          .request("http://localhost:3000")
          .delete(`/auth/${user}`)      
          .end((err, res) => {        
            res.should.have.status(200);
            done();
          });        
    });

    it("Post character", (done)=>{

        chai.request("http://localhost:3000")
            .post("/api/characters")
            .set({ token: `${token}` })
            .send({nombre: "personajeTest", edad: 123, peso: "100kg", historia: "testing con mocha y chai"})
            .end((err, res)=>{
                character = res.body.id;
                res.should.have.status(201);                
            done();
            })
        
    });    

});







