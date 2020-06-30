import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CadastroFornecedorComponent } from './cadastro-fornecedor/cadastro-fornecedor.component';
import { ConsultaFornecedorComponent } from './consulta-fornecedor/consulta-fornecedor.component';
import { CadastroProdutoComponent } from './cadastro-produto/cadastro-produto.component';
import { ConsultaProdutoComponent } from './consulta-produto/consulta-produto.component';


//importando a biblioteca de rotas do angular
import { RouterModule, Routes } from '@angular/router';

//importando a bilbioteca para realizar as requisições HTTP para a API
import { HttpClientModule } from '@angular/common/http';

//importando as bibliotecas para desenvolver formularios dinamicos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';

//registrando uma rota para cada componente
const appRoutes : Routes = [
  { path : 'cadastro-fornecedor', component : CadastroFornecedorComponent },
  { path : 'consulta-fornecedor', component : ConsultaFornecedorComponent },
  { path : 'cadastro-produto', component : CadastroProdutoComponent },
  { path : 'consulta-produto', component : ConsultaProdutoComponent },
  { path : 'cadastro-usuario', component : CadastroUsuarioComponent },
  { path : 'login-usuario', component : LoginUsuarioComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CadastroFornecedorComponent,
    ConsultaFornecedorComponent,
    CadastroProdutoComponent,
    ConsultaProdutoComponent,
    CadastroUsuarioComponent,
    LoginUsuarioComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
