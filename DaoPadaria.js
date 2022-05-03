"use strict";

import ModelError from "/ModelError.js";
import Padaria from "/Padaria.js";

export default class DaoPadaria {

    //-----------------------------------------------------------------------------------------//

    static conexao = null;

    constructor() {
        this.arrayPadaria = [];
        this.obterConexao();
    }

    /*
    *  Devolve uma Promise com a referência para o BD
    */ 
    async obterConexao() {
        if(DaoPadaria.conexao == null) {
            DaoPadaria.conexao = new Promise(function(resolve, reject) {
            let requestDB = window.indexedDB.open("PadariaDB", 1); 

            requestDB.onupgradeneeded = (event) => {
            let db = event.target.result;
            let store = db.createObjectStore("PadariaST", {
                autoIncrement: true
            });
            store.createIndex("IdProduto", "IdProduto", { unique: true });
            };

            requestDB.onerror = event => {
            reject(new ModelError("Erro: " + event.target.errorCode));
            };

            requestDB.onsuccess = event => {
            if (event.target.result) {
                // event.target.result apontará para IDBDatabase aberto
                resolve(event.target.result);
            }
            else 
                reject(new ModelError("Erro: " + event.target.errorCode));
            };
        });
        }
        return await DaoPadaria.conexao;
    }

    //-----------------------------------------------------------------------------------------//

    async obterTrabalhosEscolares() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["PadariaST"], "readonly");
                store = transacao.objectStore("PadariaST");
                indice = store.index('IdProduto');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }
            let array = [];
            indice.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {        
                const novo = Padaria.assign(cursor.value);
                array.push(novo);
                cursor.continue();
                } else {
                resolve(array);
                }
            };
        });
        this.arrayPadaria = await promessa;
        return this.arrayPadaria;
    }

    //-----------------------------------------------------------------------------------------//

    async obterPadariaPelaIdProduto(IdProduto) {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["PadariaST"], "readonly");
                store = transacao.objectStore("PadariaST");
                indice = store.index('IdProduto');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }

            let consulta = indice.get(IdProduto);
            consulta.onsuccess = function(event) { 
                if(consulta.result != null)
                resolve(Padaria.assign(consulta.result)); 
                else
                resolve(null);
            };
            consulta.onerror = function(event) { reject(null); };
        });
        let Padaria = await promessa;
        return Padaria;
    }

    //-----------------------------------------------------------------------------------------//

    async obterProdutos() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
        let transacao;
        let store;
        try {
            transacao = connection.transaction(["PadariaST"], "readonly");
            store = transacao.objectStore("PadariaST");
        } 
        catch (e) {
            reject(new ModelError("Erro: " + e));
        }
        let array = [];
        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {        
            const novo = Padaria.assign(cursor.value);
            array.push(novo);
            cursor.continue();
            } else {
            resolve(array);
            }
        };
        });
        this.arrayPadaria = await promessa;
        return this.arrayPadaria;
    }

     //-----------------------------------------------------------------------------------------//

  async incluir(Padaria) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["PadariaST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o Produto", event.target.error));
      };
      let store = transacao.objectStore("PadariaST");
      let requisicao = store.add(Padaria.deassign(Padaria));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(Padaria) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["PadariaST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o Produto", event.target.error));
      };
      let store = transacao.objectStore("PadariaST");     
      let indice = store.index('IdProduto');
      var keyValue = IDBKeyRange.only(Padaria.getIdProduto());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.IdProduto == Padaria.getIdProduto()) {
            const request = cursor.update(Padaria.deassign(Padaria));
            request.onsuccess = () => {
              console.log("[DaoPadaria.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Produto com ID: " + Padaria.getIdProduto() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(Padaria) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["PadariaST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o produto", event.target.error));
      };
      let store = transacao.objectStore("PadariaST");
      let indice = store.index('IdProduto');
      var keyValue = IDBKeyRange.only(Padaria.getIdProduto());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.IdProduto == Padaria.getIdProduto()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Produto com o ID: " + Padaria.getIdProduto() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
