class vehiculo {
    constructor(id, placa, color, marca, modelo, tipo, usuario_id) {
        this._id = id;
        this._placa = placa;
        this._color = color;
        this._marca = marca;
        this._modelo = modelo;
        this._tipo = tipo;
        this._usuario_id = usuario_id;
    }

    get getId() {
        return this._id;
    }
    get getPlaca() {
        return this._placa;
    }
    get getColor() {
        return this._color;
    }
    get getMarca() {
        return this._marca;
    }
    get getModelo() {
        return this._modelo;
    }
    get getTipo() {
        return this._tipo;
    }
    get getUsuario_id() {
        return this._usuario_id;
    }
    setId(id) {
        this._id = id;
    }
    setPlaca(placa) {
        this._placa = placa;
    }
    setColor(color) {
        this._color = color;
    }
    setMarca(marca) {
        this._marca = marca;
    }
    setModelo(modelo) {
        this._modelo = modelo;
    }
    setTipo(tipo) {
        this._tipo = tipo;
    }
    setUsuario_id(usuario_id) {
        this._usuario_id = usuario_id;
    }
}
export default vehiculo