import Status from "/Status.js";
import Padaria from "/Padaria.js";
import ViewerError from "/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerPadaria {

  #ctrl;
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar  = this.obterElemento('divNavegar'); 
    this.divComandos = this.obterElemento('divComandos'); 
    this.divAviso    = this.obterElemento('divAviso'); 
    this.divDialogo  = this.obterElemento('divDialogo');

    this.btPrimeiro  = this.obterElemento('btPrimeiro');
    this.btAnterior  = this.obterElemento('btAnterior');
    this.btProximo   = this.obterElemento('btProximo');
    this.btUltimo    = this.obterElemento('btUltimo');

    this.btIncluir   = this.obterElemento('btIncluir');
    this.btExcluir   = this.obterElemento('btExcluir');
    this.btAlterar   = this.obterElemento('btAlterar');
    this.btSair      = this.obterElemento('btSair');

    this.btOk        = this.obterElemento('btOk');
    this.btCancelar  = this.obterElemento('btCancelar');

    this.tfIdProduto = this.obterElemento('tfIdProduto');
    this.tfNomeProduto = this.obterElemento('tfNomeProduto');
    this.tfCategoriaProduto = this.obterElemento('tfCategoriaProduto');
    this.tfPrecoProduto = this.obterElemento('tfPrecoProduto');
      
    this.btPrimeiro.onclick = fnBtPrimeiro; 
    this.btProximo.onclick = fnBtProximo; 
    this.btAnterior.onclick = fnBtAnterior; 
    this.btUltimo.onclick = fnBtUltimo; 

    this.btIncluir.onclick = fnBtIncluir; 
    this.btAlterar.onclick = fnBtAlterar; 
    this.btExcluir.onclick = fnBtExcluir; 

    this.btOk.onclick = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

//------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um produto com id: '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

//------------------------------------------------------------------------//
  
  getCtrl() { 
    return this.#ctrl;
  }

//------------------------------------------------------------------------//
  
  apresentar(pos, qtde, Padaria) {    
    
    this.configurarNavegacao( pos <= 1 , pos == qtde );   

    if(Padaria == null) {
      this.tfIdProduto.value = "";
      this.tfNomeProduto.value       = "";
      this.tfCategoriaProduto.value      = "";
      this.tfPrecoProduto.value      = "";
      this.divAviso.innerHTML = " Número de Produtos: 0";
    } else {
      this.tfIdProduto.value = Padaria.getIdProduto();
      this.tfNomeProduto.value      = Padaria.getNomeProduto();
      this.tfCategoriaProduto.value     = Padaria.getCategoriaProduto();
      this.tfPrecoProduto.value      = Padaria.getPrecoProduto();
      this.divAviso.innerHTML = "Posição: " + pos + " | Número de Produtos: " + qtde;
    }
  }

//------------------------------------------------------------------------//

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled   = flagFim;
    this.btProximo.disabled  = flagFim;
    this.btAnterior.disabled = flagInicio;
  }
  
//------------------------------------------------------------------------//
  
  statusEdicao(operacao) { 
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false; 
    
    if(operacao != Status.EXCLUINDO) {
      this.tfIdProduto.disabled = false;
      this.tfNomeProduto.disabled = false;
      this.tfCategoriaProduto.disabled = false;
      this.tfPrecoProduto.disabled = false;
      this.divAviso.innerHTML = "";      
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";      
    }
    if(operacao == Status.INCLUINDO) {
      this.tfIdProduto.disabled = false;
      this.tfIdProduto.value = "";
      this.tfNomeProduto.value = "";
      this.tfCategoriaProduto.value = "";
      this.tfPrecoProduto.value = "";
    }
  }

//------------------------------------------------------------------------//
  
  statusApresentacao() { 
    this.tfIdProduto.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true; 
    this.tfNomeProduto.disabled = true;
    this.tfCategoriaProduto.disabled = true;
    this.tfPrecoProduto.disabled = true;
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarPrimeiro();
  
}

//------------------------------------------------------------------------//

function fnBtProximo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarProximo();
  
}

//------------------------------------------------------------------------//

function fnBtAnterior() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarAnterior();
  
}

//------------------------------------------------------------------------//

function fnBtUltimo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarUltimo();
  
}
//------------------------------------------------------------------------//

function fnBtIncluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarIncluir();
}

//------------------------------------------------------------------------//

function fnBtAlterar() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarAlterar();
  
}

//------------------------------------------------------------------------//

function fnBtExcluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const IdProduto = this.viewer.tfIdProduto.value;
  const NomeProduto = this.viewer.tfNomeProduto.value;
  const CategoriaProduto = this.viewer.tfCategoriaProduto.value;
  const Preco = this.viewer.tfPrecoProduto.value;
  
  
    
  // Como defini que o método "efetivar" é um dos métodos incluir, excluir ou alterar
  // não estou precisando colocar os ninhos de IF abaixo.
  this.viewer.getCtrl().efetivar(IdProduto, NomeProduto, CategoriaProduto, Preco); 

  // if(this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
  //  this.viewer.getCtrl().fnEfetivar(matricula, cpf, nome, email, telefone); 
  //} else if(this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
  //  this.viewer.getCtrl().alterar(matricula, cpf, nome, email, telefone); 
  //} else if(this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
  //  this.viewer.getCtrl().excluir(matricula, cpf, nome, email, telefone); 
  //}
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}

//------------------------------------------------------------------------//





