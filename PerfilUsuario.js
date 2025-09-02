class PerfilUsuario{
    constructor(id, Perfil){
        this._id = id;
        this._Perfil = Perfil;
    }

    get getId(){
        return this._id;
    }
    get getNombre_perfil(){
        return this._Perfil;
    }
    setId(id){
        this._id = id;
    }
    setPerfil(Perfil){
        this._Perfil = Perfil;
    }
}

export default PerfilUsuario;