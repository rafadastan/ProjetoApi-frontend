import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css']
})
export class LoginUsuarioComponent implements OnInit {

  //atributos
  mensagemProcessamento: string;
  mensagemSucesso: string;
  mensagemErro: string;

  apiUrl = "http://localhost:58799/api/Login";

  errosEmail: [];
  errosSenha: [];

  //inicializando o HttpClient por injeção de dependência
  constructor(private httpClient: HttpClient,
              private cookieService:CookieService) { }

  ngOnInit(): void {
  }

  autenticarUsuario(formLogin) {

    this.mensagemProcessamento = "Processando, por favor aguarde."
    this.mensagemSucesso = "";
    this.mensagemErro = "";

    this.errosEmail = [];
    this.errosSenha = [];

    //executando uma chamada POST para a API..
    this.httpClient.post(this.apiUrl, formLogin.value, 
      { responseType : 'text' })
      .subscribe( //captura o retorno da API
        (result) => { //recebendo o resultado de sucesso da API
          this.mensagemProcessamento = "";

          this.cookieService.set('ACCESS_TOKEN', result);
          //this.mensagemSucesso = result;

          formLogin.reset(); //limpar os campos do formulário
        },
        (e) => { //recebendo o resultado de erro da API
          this.mensagemProcessamento = "";                   

          //verificando o codigo de erro retornado pela API
          //400, 500, etc..
          if(e.status == 400){ //BAD REQUEST

            //capturando o conteudo JSON retornado pela API
            const response = JSON.parse(e.error);

            this.errosEmail = response.errors.Email;
            this.errosSenha = response.errors.Senha;
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
