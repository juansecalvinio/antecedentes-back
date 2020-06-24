const antecsMock = [
    {
        name: "DELEGADO O MIEMBRO DEL SINDICATO"
    },
    {
        name: "PROBLEMAS DE CONDUCTA"
    },
    {
        name: "PROBLEMAS DE ASISTENCIA"
    },
    {
        name: "VIOLENCIA"
    },
    {
        name: "ROBOS - HURTOS"
    },
    {
        name: "DIFICULTADES FÍSICAS CRÓNICAS"
    },
    {
        name: "ADICCIONES"
    }
];

class AntecsServicesMock {
    async getAntecs() {
        return Promise.resolve(antecsMock);
    }

    async createAntec() {
        return Promise.resolve(antecsMock[0]);
    }
}

module.exports = {
    antecsMock,
    AntecsServicesMock
}