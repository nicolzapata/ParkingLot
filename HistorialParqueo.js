class historial_parqueo {
    constructor(celda, vehiculo, fecha_hora) {
        this._celda = celda;
        this._vehiculo = vehiculo;
        this._fecha_hora = fecha_hora;
    }

    get getcelda() {
        return this._celda;
    }
    get getvehiculo() {
        return this._vehiculo;
    }
    get getfecha_hora() {
        return this._fecha_hora; // CORREGIDO: era this.fecha_hora
    }
    setcelda(celda) { // CORREGIDO: añadido parámetro
        this._celda = celda;
    }
    setvehiculo(vehiculo) { // CORREGIDO: añadido parámetro
        this._vehiculo = vehiculo;
    }
    setfecha_hora(fecha_hora) { // CORREGIDO: añadido parámetro
        this._fecha_hora = fecha_hora;
    }
}

export default historial_parqueo;
