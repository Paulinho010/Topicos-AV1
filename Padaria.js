import ModelError from "/ModelError.js";

export default class Padaria {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #IdProduto;
  #NomeProduto;
  #CategoriaProduto;
  #Preco;

  //-----------------------------------------------------------------------------------------//

  constructor(IdProduto, NomeProduto, CategoriaProduto, Preco) {
    this.setIdProduto(IdProduto);
    this.setNomeProduto(NomeProduto);
    this.setCategoriaProduto(CategoriaProduto);
    this.setPreco(Preco); 
  }
  
  //-----------------------------------------------------------------------------------------//

  getIdProduto() {
    return this.#IdProduto;
  }
  
  //-----------------------------------------------------------------------------------------//

  setIdProduto(IdProduto) {
    if(!Padaria.validarIdProduto(IdProduto))
      throw new ModelError("Produto Inválido: " + IdProduto);
    this.#IdProduto = IdProduto;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNomeProduto() {
    return this.#NomeProduto;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNomeProduto(NomeProduto) {
    if(!Padaria.validarNomeProduto(NomeProduto))
      throw new ModelError("Nome Produto Inválido: " + NomeProduto);
    this.#NomeProduto = NomeProduto;
  }
  
  //-----------------------------------------------------------------------------------------//

  getCategoriaProduto() {
    return this.#CategoriaProduto;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCategoriaProduto(CategoriaProduto) {
    if(!Padaria.validarCategoriaProduto(CategoriaProduto))
      throw new ModelError("Categoria Produto Inválido: " + CategoriaProduto);
    this.#CategoriaProduto = CategoriaProduto;
  }

  //-----------------------------------------------------------------------------------------//
  getPreco() {
    return this.#Preco;
  }
  
  //-----------------------------------------------------------------------------------------//

  setPreco(Preco) {
    if(!Padaria.validarPreco(Preco))
      throw new ModelError("Preço Inválido: " + Preco);
    this.#Preco = Preco;
  }

  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"IdProduto" : "'+ this.#IdProduto + '",' +
               '"NomeProduto" :  "' + this.#NomeProduto + '",' +
               '"CategoriaProduto" : "' + this.#CategoriaProduto + '",' +
               '"Preco" : "' + this.#Preco + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Padaria(obj.IdProduto, obj.NomeProduto, obj.CategoriaProduto, obj.Preco);
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  static validarIdProduto(IdProduto) {
    if(IdProduto == null || IdProduto == "" || IdProduto == undefined)
      return false;
    if (IdProduto.length > 10) 
      return false;
    const padraoIdProduto = /[0-9] */;
    if (!padraoIdProduto.test(IdProduto)) 
      return false;
    return true;
  }

    //-----------------------------------------------------------------------------------------//

    static validarNomeProduto(NomeProduto) {
        if(NomeProduto == null || NomeProduto == "" || NomeProduto == undefined)
          return false;
        if (NomeProduto.length > 40) 
          return false;
        const padraoNomeProduto = /[A-Z][a-z] */;
        if (!padraoNomeProduto.test(NomeProduto)) 
          return false;
        return true;
      }
  
    static validarCategoriaProduto(CategoriaProduto) {
        if(CategoriaProduto == null || CategoriaProduto == "" || CategoriaProduto == undefined)
          return false;
        if (CategoriaProduto.length > 40) 
          return false;
        const padraoCategoriaProduto = /[A-Z][a-z] */;
        if (!padraoCategoriaProduto.test(CategoriaProduto)) 
          return false;
        return true;
      }
  
    static validarPreco(Preco) {
        if (Preco.length >= 0) 
          return true;
        return false;
    }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Id Produto: " + this.IdProduto + "\n";
    texto += "NomeProduto: " + this.NomeProduto + "\n";
    texto += "CategoriaProduto: " + this.CategoriaProduto + "\n";
    texto += "Preco: " + this.Preco + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}