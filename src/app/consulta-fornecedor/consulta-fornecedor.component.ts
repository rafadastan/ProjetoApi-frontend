import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consulta-fornecedor',
  templateUrl: './consulta-fornecedor.component.html',
  styleUrls: ['./consulta-fornecedor.component.css']
})
export class ConsultaFornecedorComponent implements OnInit {

  //atributos
  listagemFornecedores = []; //array vazio

  fornecedorEdicao = {
    idFornecedor: 0,
    nome: '',
    cnpj: ''
  };

  mensagemExclusao: string;
  mensagemEdicao: string;

  errosNome: [];
  errosCnpj: [];

  //endereço do recurso que será acessado na API
  apiUrl = "http://localhost:58799/api/Fornecedores";

  //inicializar o objeto HttpClient por injeção de dependência
  constructor(private httpClient: HttpClient) { }

  //função executada sempre que o componente é renderizado
  ngOnInit(): void {
    this.consultarFornecedores();
  }

  //função para acessar a API e consultar os fornecedores
  consultarFornecedores() {

    //executando uma chamada para a API (consulta de fornecedores)
    this.httpClient.get(this.apiUrl)
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

  //função para executar a exclusão do fornecedor
  excluirFornecedor(idFornecedor) {
    if (confirm('Deseja realmente excluir o Fornecedor selecionado?')) {

      //executando o serviço de exclusão na API
      this.httpClient.delete(this.apiUrl + "/" + idFornecedor,
        { responseType: 'text' })
        .subscribe(
          (result) => { //sucesso!
            this.mensagemExclusao = result;
            this.consultarFornecedores(); //executando a consulta!
          },
          (e) => { //erro!
            console.log(e);
          }
        );
    }
  }

  //função para fechar a area de mensagem de exclusão com sucesso
  fecharMensagemExclusao() {
    this.mensagemExclusao = "";
  }

  //função para buscar os dados de 1 fornecedor na API
  //e exibir os dados dentro da janela modal
  obterFornecedor(idFornecedor) {

    //exibindo um loading na página
    this.mensagemEdicao = "";

    this.errosNome = [];
    this.errosCnpj = [];

    //acessando a API e buscar os dados do fornecedor pelo id
    this.httpClient.get(this.apiUrl + "/" + idFornecedor)
      .subscribe(
        (result: any) => { //sucesso
          this.fornecedorEdicao = result;
        },
        (e) => { //erro
          console.log(e);
        }
      );
  }

  //função para atualizar o fornecedor
  atualizarFornecedor(formEdicao) {

    //executando uma chamada PUT para a API..
    this.httpClient.put(this.apiUrl, formEdicao.value,
      { responseType: 'text' })
      .subscribe( //função que captura o retorno da API
        (result) => { //pegando a resposta de sucesso da API

          this.mensagemEdicao = result;
          this.consultarFornecedores();
        },
        (e) => { //pegando a resposta de erro da API

          //capturando o conteudo JSON retornado pelo erro
          const response = JSON.parse(e.error);

          if (e.status == 400) { //erros de validação
            this.errosNome = response.errors.Nome;
            this.errosCnpj = response.errors.Cnpj;
          }
          else if (e.status == 500) { //erro de servidor
            console.log(e);
          }
        }
      );

  }

}
