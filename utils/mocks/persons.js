const personsMock = [
    {
        firstName: "Manuel",
        lastName: "Belgrano",
        cuit: "20-36123123-2",
        age: 25
    },
    {
        firstName: "Juan Jose",
        lastName: "Pasos",
        cuit: "20-36143143-2",
        age: 31
    },
    {
        firstName: "Mariano",
        lastName: "Moreno",
        cuit: "20-36113113-2",
        age: 32
    },
];

class PersonsServicesMock {
    async getPersons() {
        return Promise.resolve(personsMock);
    }

    async createPerson() {
        return Promise.resolve(personsMock[0]);
    }
}

module.exports = {
    personsMock,
    PersonsServicesMock
}