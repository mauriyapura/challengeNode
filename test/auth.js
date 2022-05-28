const chai = require("chai");
const chaiHttp = require("chai-http");
const { before, beforeEach } = require("mocha");

// Assertion Style
chai.should();
chai.use(chaiHttp);

// Login
describe("Login", (done)=>{

    it("Login should be successful", (done)=>{

        chai.request("http://localhost:3000")
            .post("/auth/login")
            .send({email: "usuario@gmail.com", password: "12345"})
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.have.property('token');
                res.body.should.have.property('user');
            done();
            })
    });

    it("Login should fail wrong password", (done)=>{

        chai.request("http://localhost:3000")
            .post("/auth/login")
            .send({email: "usuario@gmail.com", password: "12345abc"})
            .end((err, res)=>{
                res.should.have.status(400);
                res.text.should.be.eq('"Email or password incorrect"');
            done();
            })
    });

    it("Login should fail, no password were sent", (done)=>{

        chai.request("http://localhost:3000")
            .post("/auth/login")
            .send({email: "usuario@gmail.com"})
            .end((err, res)=>{
                res.should.have.status(400);
                res.body.should.have.property('errors');                
            done();
            })
    });

});


describe("Register", (done)=>{

    it.skip("Register should be successful", (done)=>{

        const randomNum = new Date().getTime();

        chai.request("http://localhost:3000")
            .post("/auth/register")
            .send({email: `usuario${randomNum}@gmail.com`, password: "12345"})
            .end((err, res)=>{
                res.should.have.status(201);                
                res.body.should.have.property('id');
                res.body.should.have.property('email');
            done();
            })
    });

    it("Invalid Email, register should fail", (done)=>{       

        chai.request("http://localhost:3000")
            .post("/auth/register")
            .send({email: `juan123@`, password: "12345"})
            .end((err, res)=>{
                res.should.have.status(400);         
                res.body.should.have.property('errors');                   
            done();
            })
    });

});
