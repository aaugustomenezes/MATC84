import { Component, OnInit } from "@angular/core";
import { Product } from "../product.model";
import { ProductService } from "../product.service";


@Component({
  selector: "app-product-read",
  templateUrl: "./product-read.component.html",
  styleUrls: ["./product-read.component.css"],
})
export class ProductReadComponent implements OnInit {
  products!: Product[]; //não inicializa com os produtos que já tão escritos no json
  displayedColumns = ["id", "name", "price", "action"];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.updateProductList()
  }

  updateProductList(): void {
    this.productService.read().subscribe((products) => {
      this.products = products;
      console.log(products);
    });
  }

  deleteProduct(id?: number): void {
    this.productService.delete(id).subscribe(() => {
      this.productService.showMessage("Produto Deletado!");
      this.updateProductList()
    });    
  }

  onDeleteProduct(id: number): void {
    const userConfirmed = confirm('Tem certeza de que deseja remover este produto?');
    if (userConfirmed) {
      this.deleteProduct(id)
    }
  }

}
