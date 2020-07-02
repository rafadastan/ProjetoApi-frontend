import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consulta-produto',
  templateUrl: './consulta-produto.component.html',
  styleUrls: ['./consulta-produto.component.css']
})
export class ConsultaProdutoComponent implements OnInit {

  //atributos
  listagemProdutos = []; //array
  listagemFornecedores = []; //array

  apiUrlProduto = "http://localhost:58799/api/produtos";
  apiUrlFornecedor = "http://localhost:58799/api/fornecedores";

  mensagemExclusao: string;
  mensagemEdicao: string;

  produtoEdicao = {
    idProduto: 0,
    nome: "",
    preco: 0,
    quantidade: 0,
    idFornecedor: 0
  };

  errosNome: [];
  errosPreco: [];
  errosQuantidade: [];
  errosIdFornecedor: [];

  constructor(private httpClient: HttpClient) { }

  //método executado quando o componente é renderizado
  ngOnInit(): void {
    this.consultarProdutos(); //executando a função
  }

  //função para executar a consulta de produtos na API
  consultarProdutos() {
    //realizando uma consulta na API
    this.httpClient.get(this.apiUrlProduto)
      .subscribe(
        (result: any[]) => { //obtendo o retorno de sucesso
          this.listagemProdutos = result;
        },
        (e) => { //obtendo o retorno de erro
          console.log(e);
        }
      );
  }

  //função para consultar os fornecedores
  consultarFornecedores() {
    //executando uma chamada para a API (consulta de fornecedores)
    this.httpClient.get(this.apiUrlFornecedor)
      .subscribe(
        (result: any[]) => { //obtendo a resposta de sucesso da API
          //any[] -> define o tipo de retorno de dados da API (JSON ARRAY)
          this.listagemFornecedores = result;
        },
        (e) => { //obtendo a resposta de erro da API
          console.log(e); //imprime o erro no console do navegador
        }
      );
  }

  //função para realizar a exclusão do produto
  excluirProduto(idProduto) {
    if (confirm('Deseja realmente excluir o Produto selecionado?')) {

      //executando o serviço de exclusão na API
      this.httpClient.delete(this.apiUrlProduto + "/" + idProduto,
        { responseType: 'text' })
        .subscribe(
          (result) => { //sucesso!
            this.mensagemExclusao = result;
            this.consultarProdutos(); //executando a consulta!
          },
          (e) => { //erro!
            console.log(e);
          }
        );
    }
  }

  //ocultar a mensagem de exclusão
  fecharMensagemExclusao() {
    this.mensagemExclusao = "";
  }

  //buscar 1 produto na API baseado no ID
  obterProduto(idProduto) {

    this.mensagemExclusao = "";
    this.mensagemEdicao = "";

    this.errosNome = [];
    this.errosPreco = [];
    this.errosQuantidade = [];
    this.errosIdFornecedor = [];

    this.httpClient.get(this.apiUrlProduto + "/" + idProduto)
      .subscribe(
        (result: any) => {
          this.produtoEdicao = result;
          this.consultarFornecedores();
        },
        (e) => {
          console.log(e);
        }
      );
  }

  //função para atualizar o produto
  atualizarProduto(formEdicao) {

    //executando uma chamada PUT para a API..
    this.httpClient.put(this.apiUrlProduto, formEdicao.value,
      { responseType: 'text' })
      .subscribe( //função que captura o retorno da API
        (result) => { //pegando a resposta de sucesso da API

          this.mensagemEdicao = result;
          this.consultarProdutos();
        },
        (e) => { //pegando a resposta de erro da API

          //capturando o conteudo JSON retornado pelo erro
          const response = JSON.parse(e.error);

          if (e.status == 400) { //erros de validação
            this.errosNome = response.errors.Nome;
            this.errosPreco = response.errors.Preco;
            this.errosQuantidade = response.errors.Quantidade;
            this.errosIdFornecedor = response.errors.IdFornecedor;
          }
          else if (e.status == 500) { //erro de servidor
            console.log(e);
          }
        }
      );
  }
}
