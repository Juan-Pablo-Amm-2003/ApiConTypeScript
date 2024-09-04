import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sqlConfig";

export class ProductModel extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public imagePath!: string;
  public category_id!: number;
  public stock!: number; 
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
      allowNull: false,
      defaultValue: 0, 
    },
  },
  {
    sequelize,
    tableName: "products",
  }
);
