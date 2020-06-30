import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css']
})
export class CadastroProdutoComponent implements OnInit {

  listagemFornecedores = [];

  apiUrlFornecedor = "http://localhost:58799/api/Fornecedores";
  apiUrlProduto = "http://localhost:58799/api/Produtos";

  mensagemProcessamento:string;
  mensagemSucesso:string;
  mensagemErro:string;

  errosNome:[]; //array vazio
  errosPreco:[]; //array vazio
  errosQuantidade:[]; //array vazio
  errosIdFornecedor:[]; //array vazio

  //inicializar o httpClient por injeção de dependência
  constructor(private httpClient:HttpClient) { }

  ngOnInit(): void {
    this.consultarFornecedores();
  }

  //função para consultar os fornecedores
  consultarFornecedores(){
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

  //função para realizar o cadastro do produto
  cadastrarProduto(formCadastro){
    
    //exibindo um loading na página
    this.mensagemProcessamento = "Processando, por favor aguarde.";
    this.mensagemSucesso = "";
    this.mensagemErro = "";

    this.errosNome = [];
    this.errosPreco = [];
    this.errosQuantidade = [];
    this.errosIdFornecedor = [];

    //executando uma chamada POST para a API..
    this.httpClient.post(this.apiUrlProduto, formCadastro.value, 
      { responseType : 'text' })
      .subscribe( //função que captura o retorno da API
        (result) =>{ //pegando a resposta de sucesso da API
          
          this.mensagemSucesso = result;
          this.mensagemProcessamento = "";

          formCadastro.reset();
        },
        (e) => { //pegando a resposta de erro da API
          
          console.log(e);

          this.mensagemProcessamento = "";

          //capturando o conteudo JSON retornado pelo erro
          const response = JSON.parse(e.error);

          if(e.status == 400){ //erros de validação
            this.errosNome = response.errors.Nome;
            this.errosPreco = response.errors.Preco;
            this.errosQuantidade = response.errors.Quantidade;
            this.errosIdFornecedor = response.errors.IdFornecedor;
          }
          else if(e.status == 500){ //erro de servidor
            this.mensagemErro = response.errors;
          }
        }
      );
  }
}
