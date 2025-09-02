class celda {
    constructor(id, tipo, estado) {
        this._id = id;
        this._tipo = tipo;
        this._estado = estado;
    }
    get getid() {
        return this._id;
    }
    get gettipo() {
        return this._tipo;
    }
    get getestado() {
        return this._estado;
    }
    setid(id) { // ← Agregar parámetro
        this._id = id;
    }
    setestado(estado) { // ← Agregar parámetro
        this._estado = estado;
    }
    settipo(tipo) { // ← Agregar parámetro
        this._tipo = tipo;
    }
}

export default celda;