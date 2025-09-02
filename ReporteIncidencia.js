class reporte_incidencia {
    constructor(vehiculo, incidencia, fecha_hora) {
        this._vehiculo = vehiculo;
        this._incidencia = incidencia;
        this._fecha_hora = fecha_hora;
    }

    get getvehiculo() {
        return this._vehiculo
    }
    get getinsidencia() {
        return this._insidencia
    }
    get getfecha_hora() {
        return this._fecha_hora
    }

    setvehiculo() {
        this._vehiculo= vehiculo
    }
    setinsidencia() {
        this._incidencia= incidencia
    }
    setfecha_hora() {
        this._fecha_hora= fecha_hora
    }
}
export default reporte_incidencia;
