import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cadastro-fornecedor',
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrls: ['./cadastro-fornecedor.component.css']
})
export class CadastroFornecedorComponent implements OnInit {

  //atributos
  mensagemProcessamento:string;
  mensagemSucesso:string;
  mensagemErro:string;

  errosNome:[];
  errosCnpj:[];

  apiUrl = "http://localhost:58799/api/fornecedores";

  accessToken: string;

  //método construtor
  constructor(private httpClient:HttpClient,
              private cookieService:CookieService) { }

  //método
  ngOnInit(): void {
    this.obterToken();
  }

  //método
  cadastrarFornecedor(formCadastro){
    
    //exibindo um loading na página
    this.mensagemProcessamento = "Processando, por favor aguarde.";
    this.mensagemSucesso = "";
    this.mensagemErro = "";
    this.errosNome = [];
    this.errosCnpj = [];

    var httpHeaders = new HttpHeaders()
        .set('Authorization', 'Bearer ' + this.accessToken);

    this.httpClient.post(this.apiUrl,formCadastro.value,
      {responseType: 'text', headers:httpHeaders})
      .subscribe( //retorno da api
        (result)=>{ // pegando a resposta de sucesso da api
          this.mensagemSucesso = result;
          this.mensagemProcessamento = "";
          formCadastro.reset();
      },
      (e)=>{ // Pegando o erro da api
        const response = JSON.parse(e.error);

        if(e.status == 400){// erro de validacao
            this.errosNome = response.errors.Nome;
            this.errosCnpj = response.errors.Cnpj;
        }else if(e.status == 500) { //Erro de servidor
          this.mensagemErro = response.errors;
        }
      }
    );
  }

  obterToken(){
    this.accessToken = this.cookieService.get("ACCESS_TOKEN");
  }

}
