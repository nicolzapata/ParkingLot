class acceso_salidas {
    constructor(id, movimiento, fecha_hora, puerta, tiempo_estadia, vehiculo) {
        this._id = id;
        this._movimiento= movimiento;
        this._fecha_hora = fecha_hora;
        this._puerta = puerta;
        this._tiempo_estadia = tiempo_estadia;
        this._vehiculo = vehiculo;
    }


    get getId() {
        return this._id;
    }
    get getMovimiento() {
        return this._movimiento;
    }
    get getFecha_hora() {
        return this._fecha_hora;
    }
    get getPuerta() {
        return this._puerta;
    }
    get getTiempo_estadia() {
        return this._tiempo_estadia;
    }
    get getVehiculo() {
        return this._vehiculo;
    }
    setId(id) {
        this._id = id;
    }
    setMovimiento(movimiento) {
        this._movimiento = movimiento;
    }
    setFecha_hora(fecha_hora) {
        this._fecha_hora = fecha_hora;
    }
    setPuerta(puerta) {
        this._puerta = puerta;
    }
    setTiempo_estadia(tiempo_estadia) {
        this._tiempo_estadia = tiempo_estadia;
    }
    setVehiculo(vehiculo) {
        this._vehiculo = vehiculo;
    }
}

export default acceso_salidas;