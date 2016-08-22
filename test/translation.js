'use strict';


const Code = require('code');
const Lab = require('lab');
const Translate = require('../lib/translate');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('Schema translation', () => {
    it('Auth0 --> SCIM', done => {
        const user = require('../fixtures/auth0-user.json');

        return Translate.fromAuth0(user, (error, json) => {
            expect(error).to.not.exist();
            expect(json).to.be.an.object();

            done();
        });
    });
    
    it('SCIM --> Auth0', done => {
        const scimUser = require('../fixtures/scim-user.json');
        
        return Translate.toAuth0(scimUser, (error, json) => {
            expect(error).to.not.exist();
            expect(json).to.be.an.object();
            
            done();
        });
    });
    
    it('SCIM --> Auth0 --> SCIM', done => {
        const scimUser = require('../fixtures/scim-user.json');
        
        return Translate.toAuth0(scimUser, (error, auth0User) => {
            expect(error).to.not.exist();
            expect(auth0User).to.be.an.object();
            
            return Translate.toAuth0(auth0User, (error, newScimUser) => {
                expect(error).to.not.exist();
                expect(scimUser).to.equal(newScimUser);
                
                done();
            });
        });
    });
});


if (require.main === module) {
    Lab.report([lab], { output: process.stdout, progress: 2 });
}
