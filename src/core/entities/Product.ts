import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Category } from "./Category.js";

interface ProductImage {
    url: string;
    esPrincipal: boolean;
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column({ type: 'varchar', length: 200, unique: true })
    nombre!: string; 

    @Column({ type: 'text', nullable: true })
    descripcion?: string; 

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio!: number; 

    @Column({ type: 'int' })
    stockDisponible!: number; 

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    pesoKg?: number; 

    @Column({ type: 'json', nullable: true })
    imagenes?: ProductImage[]; 

    @ManyToMany(() => Category)
    @JoinTable({
        name: "product_categories",
        joinColumn: { name: "productId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "categoryId", referencedColumnName: "id" }
    })
    categorias!: Category[]; 
}