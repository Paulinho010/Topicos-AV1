"use strict";

import Status from "/Status.js";
import Padaria from "/Padaria.js";
import DaoPadaria from "/DaoPadaria.js";
import ViewerPadaria from "/ViewerPadaria.js";

export default class CtrlManterPadaria {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de PadariasEscolares
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Produto que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoPadaria();
    this.#viewer = new ViewerPadaria(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os produtos presentes na base
    let conjProdutos = await this.#dao.obterProdutos();
    
    // Se a lista de produtos estiver vazia
    if(conjProdutos.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjProdutos.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjProdutos.length, conjProdutos[this.#posAtual - 1]);
    }
  }
  
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjProdutos = await this.#dao.obterProdutos();
    if(conjProdutos.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjProdutos = await this.#dao.obterProdutos();
    if(this.#posAtual < conjProdutos.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjProdutos = await this.#dao.obterProdutos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjProdutos = await this.#dao.obterProdutos();
    this.#posAtual = conjProdutos.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(IdProduto, NomeProduto, CategoriaProduto, Preco) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let Padaria = new Padaria(IdProduto, NomeProduto, CategoriaProduto, Preco);
        await this.#dao.incluir(Padaria); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(IdProduto, NomeProduto, CategoriaProduto, Preco) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let Padaria = await this.#dao.obterPadariaPelaIdProduto(IdProduto); 
        if(Padaria == null) {
          alert("Produto com o ID:  " + IdProduto + " não encontrado.");
        } else {
          Padaria.setNomeProduto(NomeProduto);
          Padaria.setCategoriaProduto(CategoriaProduto);
          Padaria.setPreco(Preco);
          await this.#dao.alterar(Padaria); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async excluir(IdProduto) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let Padaria = await this.#dao.obterPadariaPelaIdProduto(IdProduto); 
        if(Padaria == null) {
          alert("Produto com o ID:  " + IdProduto + " não encontrado.");
        } else {
          await this.#dao.excluir(Padaria); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//
