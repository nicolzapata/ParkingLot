class Usuario{
    constructor(id_usuario,tipo_documento, numero_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,direccion_correo, numero_celular, foto_perfil, estado, clave, perfil_usuario){
        this._id_usuario = id_usuario;
        this._tipo_documento = tipo_documento;
        this._numero_documento = numero_documento;
        this._primer_nombre = primer_nombre;
        this._segundo_nombre = segundo_nombre;
        this._primer_apellido = primer_apellido;
        this._segundo_apellido = segundo_apellido;
        this._direccion_correo = direccion_correo;
        this._numero_celular = numero_celular;
        this._foto_perfil = foto_perfil;
        this._estado = estado;
        this._clave = clave;
        this._perfil_usuario = perfil_usuario;
    }

    get getId(){
        return this._id_usuario;
    }
    get getTipo_documento(){
        return this._tipo_documento;
    }
    get getNumero_documento(){
        return this._numero_documento;
    }
    get getPrimer_nombre(){
        return this._primer_nombre;
    }
    get getSegundo_nombre(){
        return this._segundo_nombre;
    }
    get getPrimer_apellido(){
        return this._primer_apellido;
    }
    get getSegundo_apellido(){
        return this._segundo_apellido;
    }
    get getDireccion_correo(){
        return this._direccion_correo;
    }
    get getNumero_celular(){
        return this._numero_celular;
    }
    get getFoto_perfil(){
        return this._foto_perfil;
    }
    get getEstado(){
        return this._estado;
    }
    get getClave(){
        return this._clave;
    }
    get getPerfil_usuario(){
        return this._perfil_usuario;
    }
    setId(id_usuario){
        this._id_usuario = id_usuario;
    }
    setTipo_documento(tipo_documento){
        this._tipo_documento = tipo_documento;
    }
    setNumero_documento(numero_documento){
        this._numero_documento = numero_documento;
    }
    setPrimer_nombre(primer_nombre){
        this._primer_nombre = primer_nombre;
    }
    setSegundo_nombre(segundo_nombre){
        this._segundo_nombre = segundo_nombre;
    }
    setPrimer_apellido(primer_apellido){
        this._primer_apellido = primer_apellido;
    }
    setSegundo_apellido(segundo_apellido){
        this._segundo_apellido = segundo_apellido;
    }
    setDireccion_correo(direccion_correo){
        this._direccion_correo = direccion_correo;
    } 
    setNumero_celular(numero_celular){
        this._numero_celular = numero_celular;
    }
    setFoto_perfil(foto_perfil){
        this._foto_perfil = foto_perfil;
    }
    setEstado(estado){
        this._estado = estado;
    }
    setClave(clave){
        this._clave = clave;
    }
    setPerfil_usuario(perfil_usuario){
        this._perfil_usario = perfil_usuario;
    }
}

export default Usuario;
