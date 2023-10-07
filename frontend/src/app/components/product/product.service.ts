import { HttpClient } from "@angular/common/http";
import { Component, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Product } from "./product.model";
import { EMPTY, Observable, catchError, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  baseUrl = "http://localhost:3001/produtos";

  //Classe que faz a conexão com o backend.

  constructor(private SnackBar: MatSnackBar, private http: HttpClient) {}

  showMessage(msg: string, isError: boolean = false): void {
    this.SnackBar.open(msg, "X",{
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success']
      //linha22: Precisa alterar os parâmetros do css do showMessage de acordo com o funcionamento do sistema.
    });
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
    map ((obj) => obj),
    catchError(e => this.errorHandler(e))
    );
  }

  read(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      map ((obj) => obj),
      catchError(e => this.errorHandler(e))
      );
  }
  //consultar a lista de produtos cadastrados.

  readById(id?: number): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      map ((obj) => obj),
      catchError(e => this.errorHandler(e))
      );
  }

  update(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/${product.id}`;
    return this.http.put<Product>(url, product).pipe(
      map ((obj) => obj),
      catchError(e => this.errorHandler(e))
      );
  }

  delete(id?: number): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Product>(url).pipe(
      map ((obj) => obj),
      catchError(e => this.errorHandler(e))
      );
  }
  //Avisar ao usuário sobre a ocorrência de um erro.
  errorHandler(e: any): Observable<any> {
    this.showMessage('Ocorreu um erro!', true)
    return EMPTY
  }

}
