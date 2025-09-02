class pico_placa {
    constructor(id, tipo_vehiculo, numero, dia) {
        this._id = id;
        this._tipo_vehiculo = tipo_vehiculo;
        this._numero = numero;
        this._dia = dia;
    }
    get getid() {
        return this._id;
    }
    get gettipo_vehiculo() {
        return this._tipo_vehiculo;
    }
    get getnumero() {
        return this._numero;
    }
    get getdia() {
        return this._dia;
    }
    setid() {
        this._id = id;
    }
    settipo_vehiculo() {
        this._tipo_vehiculo = tipo_vehiculo;
    }
    setnumero() {
        this._numero = numero;
    }
    setdia() {
        this._dia = dia;
    }
}
export default pico_placa;