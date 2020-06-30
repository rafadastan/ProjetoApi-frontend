import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  //atributos
  mensagemProcessamento:string;
  mensagemSucesso:string;
  mensagemErro:string;

  apiUrl = "http://localhost:58799/api/Usuario";

  errosNome:[];
  errosEmail:[];
  errosSenha:[];
  errosSenhaConfirmacao:[];

  //construtor da classe (injeção de dependência)
  constructor(private httpClient:HttpClient) { }

  ngOnInit(): void {
  }

  //função executada pelo SUBMIT do formulário
  cadastrarUsuario(formCadastro){

    this.mensagemProcessamento = "Processando, por favor aguarde."
    this.mensagemSucesso = "";
    this.mensagemErro = "";

    this.errosNome = [];
    this.errosEmail = [];
    this.errosSenha = [];
    this.errosSenhaConfirmacao = [];

    //executando uma chamada POST para a API..
    this.httpClient.post(this.apiUrl, formCadastro.value, 
      { responseType : 'text' })
      .subscribe( //captura o retorno da API
        (result) => { //recebendo o resultado de sucesso da API
          this.mensagemProcessamento = "";
          this.mensagemSucesso = result;

          formCadastro.reset(); //limpar os campos do formulário
        },
        (e) => { //recebendo o resultado de erro da API
          this.mensagemProcessamento = "";                   

          //verificando o codigo de erro retornado pela API
          //400, 500, etc..
          if(e.status == 400){ //BAD REQUEST

            //capturando o conteudo JSON retornado pela API
            const response = JSON.parse(e.error);

            this.errosNome = response.errors.Nome;
            this.errosEmail = response.errors.Email;
            this.errosSenha = response.errors.Senha;
            this.errosSenhaConfirmacao = response.errors.SenhaConfirmacao;
          }
          else if(e.status == 403){
            this.mensagemErro = e.error;
          }
          else if(e.status == 500){ //INTERNAL SERVER ERROR
            this.mensagemErro = e.error;
          }
        }
      );
  }
}
