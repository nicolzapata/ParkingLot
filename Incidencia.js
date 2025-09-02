class incidencia {
    constructor(id,nombre){
        this._id = id;
        this._nombre = nombre;
    }

    get getid() {
        return this._id;
    }
    get getnombre() {
        return this._nombre;
    }
    setid() {
        this._id= id;
    }
    setnombre() {
        this._nombre= nombre;
    }
} 

export default incidencia;