import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sqlConfig";

export class ProductModel extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public imagePath!: string;
  public category_id!: number;
  public stock!: number; // Añadido el campo `stock`
}

ProductModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false, // Asegúrate de que esto coincide con la estructura de la base de datos
      defaultValue: 0, // O cualquier valor por defecto que desees
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);
